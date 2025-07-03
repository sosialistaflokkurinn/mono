#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

console.log("🚀 Starting development server with Cloudflare tunnel...\n");

// Function to update .env file with tunnel hostname
function updateEnvFile(hostname) {
	const envPath = join(projectRoot, ".env");
	let envContent = "";

	try {
		envContent = readFileSync(envPath, "utf-8");
	} catch {
		// If .env doesn't exist, start with empty content
		console.log("📝 Creating new .env file...");
	}

	// Remove existing VITE_HOSTNAME line if it exists
	const lines = envContent.split("\n").filter((line) => !line.startsWith("VITE_HOSTNAME="));

	// Add the new hostname
	lines.push(`VITE_HOSTNAME=${hostname}`);

	// Write back to file
	writeFileSync(envPath, lines.join("\n"));
	console.log(`✅ Updated VITE_HOSTNAME=${hostname} in .env file`);
}

// Start Cloudflare tunnel
console.log("🌐 Starting Cloudflare tunnel...");
const tunnel = spawn("cloudflared", ["tunnel", "--url", "http://localhost:4200"], {
	stdio: ["inherit", "pipe", "pipe"],
});

let hostname = null;

// Add timeout for tunnel setup
const timeoutId = setTimeout(() => {
	if (!hostname) {
		console.log("\n⏰ Tunnel setup is taking longer than expected...");
		console.log("💡 You can also manually run: cloudflared tunnel --url http://localhost:4200");
		console.log("   Then copy the hostname and set VITE_HOSTNAME in your .env file\n");
	}
}, 30000); // 30 second timeout

// Parse tunnel output to extract hostname
tunnel.stdout.on("data", (data) => {
	const output = data.toString();
	console.log("🌐 STDOUT:", output.trim());

	// Look for the tunnel URL in the output - multiple patterns
	const urlPatterns = [
		/https:\/\/([a-zA-Z0-9-]+\.trycloudflare\.com)/,
		/Your quick Tunnel: (https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/,
		/INF \| (https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/,
	];

	for (const pattern of urlPatterns) {
		const urlMatch = output.match(pattern);
		if (urlMatch && !hostname) {
			const fullUrl = urlMatch[1] || urlMatch[0];
			hostname = fullUrl.replace("https://", "");
			clearTimeout(timeoutId);
			console.log(`\n🎉 Tunnel ready! Hostname: ${hostname}\n`);

			// Update .env file with the hostname
			updateEnvFile(hostname);

			// Start Vite dev server after tunnel is ready
			console.log("⚡ Starting Vite development server...\n");
			const vite = spawn("vite", ["dev"], {
				stdio: "inherit",
				cwd: projectRoot,
				env: {
					...process.env,
					VITE_HOSTNAME: hostname,
				},
			});

			// Handle Vite process exit
			vite.on("close", (code) => {
				console.log(`\n⚡ Vite dev server exited with code ${code}`);
				tunnel.kill();
				process.exit(code);
			});

			// Handle SIGINT (Ctrl+C) to clean up both processes
			process.on("SIGINT", () => {
				console.log("\n🛑 Shutting down...");
				vite.kill();
				tunnel.kill();
				process.exit(0);
			});
			break;
		}
	}
});

tunnel.stderr.on("data", (data) => {
	const output = data.toString();
	console.log("🌐 STDERR:", output.trim());

	// Also check stderr for tunnel URL (sometimes it appears there)
	const urlPatterns = [
		/https:\/\/([a-zA-Z0-9-]+\.trycloudflare\.com)/,
		/Your quick Tunnel: (https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/,
		/INF \| (https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/,
	];

	for (const pattern of urlPatterns) {
		const urlMatch = output.match(pattern);
		if (urlMatch && !hostname) {
			const fullUrl = urlMatch[1] || urlMatch[0];
			hostname = fullUrl.replace("https://", "");
			clearTimeout(timeoutId);
			console.log(`\n🎉 Tunnel ready! Hostname: ${hostname}\n`);

			// Update .env file with the hostname
			updateEnvFile(hostname);

			// Start Vite dev server after tunnel is ready
			console.log("⚡ Starting Vite development server...\n");
			const vite = spawn("vite", ["dev"], {
				stdio: "inherit",
				cwd: projectRoot,
				env: {
					...process.env,
					VITE_HOSTNAME: hostname,
				},
			});

			// Handle Vite process exit
			vite.on("close", (code) => {
				console.log(`\n⚡ Vite dev server exited with code ${code}`);
				tunnel.kill();
				process.exit(code);
			});

			// Handle SIGINT (Ctrl+C) to clean up both processes
			process.on("SIGINT", () => {
				console.log("\n🛑 Shutting down...");
				vite.kill();
				tunnel.kill();
				process.exit(0);
			});
			break;
		}
	}
});

tunnel.on("close", (code) => {
	console.log(`\n🌐 Cloudflare tunnel exited with code ${code}`);
	process.exit(code);
});

// Handle script termination
process.on("SIGTERM", () => {
	console.log("\n🛑 Received SIGTERM, shutting down...");
	tunnel.kill();
	process.exit(0);
});
