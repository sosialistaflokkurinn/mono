#!/usr/bin/env node
import { spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = __dirname;

console.log("🚀 Starting tunnel for containerized development...\n");
console.log("📋 Prerequisites:");
console.log("   • Docker Compose running: docker compose -f docker-compose.dev.yml up -d");
console.log("   • Container dev server: pnpm dev (inside container)");
console.log("");

// Function to update .env file with tunnel hostname
function updateEnvFile(hostname) {
  const envPath = join(projectRoot, "web", ".env");
  let envContent = "";

  try {
    envContent = readFileSync(envPath, "utf-8");
  } catch {
    console.log("📝 Creating new .env file...");
  }

  // Remove existing VITE_HOSTNAME line if it exists
  const lines = envContent
    .split("\n")
    .filter((line) => !line.startsWith("VITE_HOSTNAME="));

  // Add the new hostname
  lines.push(`VITE_HOSTNAME=${hostname}`);

  // Write back to file
  writeFileSync(envPath, lines.join("\n"));
  console.log(`✅ Updated VITE_HOSTNAME=${hostname} in web/.env file`);
}


// Start Cloudflare tunnel
console.log("🌐 Starting Cloudflare tunnel...");
const tunnel = spawn(
  "cloudflared",
  ["tunnel", "--url", "http://localhost:4200"],
  {
    stdio: ["inherit", "pipe", "pipe"],
  },
);

let hostname = null;

// Add timeout for tunnel setup
const timeoutId = setTimeout(() => {
  if (!hostname) {
    console.log("\n⏰ Tunnel setup is taking longer than expected...");
    console.log(
      "💡 You can also manually run: cloudflared tunnel --url http://localhost:4200",
    );
    console.log(
      "   Then copy the hostname and set VITE_HOSTNAME in your web/.env file\n",
    );
  }
}, 30000); // 30 second timeout

// Parse tunnel output to extract hostname
tunnel.stdout.on("data", (data) => {
  const output = data.toString();
  console.log("🌐", output.trim());

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
      console.log(`\n🎉 Tunnel ready! Hostname: ${hostname}`);

      // Update .env file with the hostname
      updateEnvFile(hostname);

      // Show ready message
      console.log(`\n🚀 Tunnel ready!`);
      console.log(`   • Local: http://localhost:4200`);
      console.log(`   • Public: https://${hostname}`);
      console.log(`   • Database: pnpm db:studio (from packages/db)`);
      console.log(`\n📋 Next steps:`);
      console.log(`   1. Start dev server: pnpm dev (in container)`);
      console.log(`   2. Add https://${hostname}/api/auth/callback to Kenni settings`);
      console.log(`   3. Test authentication at https://${hostname}`);
      break;
    }
  }
});

tunnel.stderr.on("data", (data) => {
  const output = data.toString();
  console.log("🌐", output.trim());

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
      console.log(`\n🎉 Tunnel ready! Hostname: ${hostname}`);

      // Update .env file with the hostname
      updateEnvFile(hostname);

      // Show ready message
      console.log(`\n🚀 Tunnel ready!`);
      console.log(`   • Local: http://localhost:4200`);
      console.log(`   • Public: https://${hostname}`);
      console.log(`   • Database: pnpm db:studio (from packages/db)`);
      console.log(`\n📋 Next steps:`);
      console.log(`   1. Start dev server: pnpm dev (in container)`);
      console.log(`   2. Add https://${hostname}/api/auth/callback to Kenni settings`);
      console.log(`   3. Test authentication at https://${hostname}`);
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

process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down tunnel...");
  tunnel.kill();
  process.exit(0);
});