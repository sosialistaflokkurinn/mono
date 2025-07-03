import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: 4200,
		host: "0.0.0.0",
		allowedHosts: true,
	},
	plugins: [
		// Enables Vite to resolve imports using path aliases.
		tsconfigPaths(),
		tanstackStart(),
		tailwindcss(),
	],
});
