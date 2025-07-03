import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env["DATABASE_URL"] ?? "postgresql://postgres:postgres@localhost:5434/xj",
	},
	casing: "snake_case",
});
