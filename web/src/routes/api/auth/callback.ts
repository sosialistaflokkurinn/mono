import { createServerFileRoute } from "@tanstack/react-start/server";
import { db, KenniLogin, User } from "@xj/db";
import { exchangeCodeForTokens, parseIdTokenClaims } from "@xj/kenni";
import { eq } from "drizzle-orm";
import { ok, safeTry } from "neverthrow";

import { env } from "~/lib/env";
import { createSession } from "~/lib/jwt-session";

export const ServerRoute = createServerFileRoute("/api/auth/callback").methods({
	GET: async ({ request }) => {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");

		if (!code || !state) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/login?error=invalid_request",
				},
			});
		}

		// Extract next URL and code verifier from state parameter
		const [, nextParam, codeVerifier] = state.split(":");
		const nextUrl = nextParam ? decodeURIComponent(nextParam) : "/";

		if (!codeVerifier) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/login?error=invalid_state",
				},
			});
		}

		// Process authentication with safeTry for clean error handling
		const authResult = await safeTry(async function* () {
			// Create redirect URI for token exchange
			const redirectUri = `https://${env.VITE_HOSTNAME}/api/auth/callback`;

			// Exchange authorization code for tokens
			const tokens = yield* await exchangeCodeForTokens({
				issuerUrl: env.KENNI_ISSUER_URL,
				clientId: env.KENNI_CLIENT_ID,
				clientSecret: env.KENNI_CLIENT_SECRET,
				code,
				redirectUri,
				codeVerifier,
			});

			// Parse and validate ID token claims
			const claims = yield* parseIdTokenClaims(tokens.id_token);

			const fullName = claims.name;
			const kennitala = claims.national_id;

			// Check if user exists by personal code (unique identifier from Kenni)
			const existingUsers = await db
				.select()
				.from(User)
				.where(eq(User.personalCode, kennitala))
				.limit(1);

			let user = existingUsers[0] ?? undefined;

			if (!user) {
				// Create new user
				const newUsers = await db
					.insert(User)
					.values({
						personalCode: kennitala,
						fullName: fullName,
						birthDate: new Date(), // TODO: Parse from kennitala
						kennitalType: "person", // TODO: Parse from kennitala
					})
					.returning();
				user = newUsers[0]!;
			}

			// Log the Kenni login
			await db.insert(KenniLogin).values({
				userId: user.id,
				kennitalId: claims.sub,
				idToken: tokens.id_token, // Store encrypted in production
				accessToken: tokens.access_token, // Store encrypted in production
				userClaims: JSON.stringify(claims),
				ipAddress:
					request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
				userAgent: request.headers.get("user-agent") || "unknown",
			});

			// Create session
			await createSession({
				userId: user.id,
				name: user.fullName,
				role: user.role,
			});

			return ok(nextUrl);
		});

		// Handle authentication errors
		if (authResult.isErr()) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/login?error=auth_failed",
				},
			});
		}

		// Redirect to the next page or default
		return new Response(null, {
			status: 302,
			headers: {
				Location: authResult.value,
			},
		});
	},
});
