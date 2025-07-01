import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These variables are only available on the server and will NOT be included in the client bundle
   */
  server: {
    DATABASE_URL: z.string().url(),
    SESSION_SECRET: z.string().min(32),
    KENNI_CLIENT_ID: z.string(),
    KENNI_CLIENT_SECRET: z.string(),
    KENNI_ISSUER_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    POSTMARK_SERVER_API_TOKEN: z.string(),
    SENTRY_DSN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "VITE_",

  /**
   * Client-side environment variables schema
   * These variables are prefixed with VITE_ and will be included in the client bundle
   * IMPORTANT: Never put sensitive data here!
   */
  client: {
    VITE_HOSTNAME: z.string(),
    VITE_SENTRY_DSN: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime.
   * For Vite, we need to use import.meta.env for client variables and process.env for server variables.
   * T3 Env Core will automatically handle the client/server separation.
   */
  runtimeEnv: {
    // Server variables (from process.env)
    DATABASE_URL: process.env["DATABASE_URL"],
    SESSION_SECRET: process.env["SESSION_SECRET"],
    KENNI_CLIENT_ID: process.env["KENNI_CLIENT_ID"],
    KENNI_CLIENT_SECRET: process.env["KENNI_CLIENT_SECRET"],
    KENNI_ISSUER_URL: process.env["KENNI_ISSUER_URL"],
    JWT_SECRET: process.env["JWT_SECRET"],
    POSTMARK_SERVER_API_TOKEN: process.env["POSTMARK_SERVER_API_TOKEN"],
    SENTRY_DSN: process.env["SENTRY_DSN"],
    SENTRY_ORG: process.env["SENTRY_ORG"],
    SENTRY_PROJECT: process.env["SENTRY_PROJECT"],
    SENTRY_AUTH_TOKEN: process.env["SENTRY_AUTH_TOKEN"],
    NODE_ENV: process.env["NODE_ENV"],
    
    // Client variables (from import.meta.env)
    VITE_HOSTNAME: import.meta.env["VITE_HOSTNAME"],
    VITE_SENTRY_DSN: import.meta.env["VITE_SENTRY_DSN"],
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
