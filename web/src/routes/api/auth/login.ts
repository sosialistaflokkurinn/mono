import { createServerFileRoute } from "@tanstack/react-start/server";
import {
	createKenniAuthorizationUrl,
	generateCodeVerifier,
	generateNonce,
	generateState,
} from "@xj/kenni";

import { env } from "~/lib/env";

export const ServerRoute = createServerFileRoute("/api/auth/login").methods({
	GET: async ({ request }) => {
		const url = new URL(request.url);
		const nextUrl = url.searchParams.get("next") || "/";

		// Generate PKCE and OIDC parameters for secure auth flow
		const redirectUri = `https://${env.VITE_HOSTNAME}/api/auth/callback`;
		const state = generateState();
		const nonce = generateNonce();
		const codeVerifier = generateCodeVerifier();

		console.info("Starting Kenni authentication, redirect URI:", redirectUri);

		const authUrlResult = await createKenniAuthorizationUrl({
			issuerUrl: env.KENNI_ISSUER_URL,
			clientId: env.KENNI_CLIENT_ID,
			redirectUri,
			codeVerifier,
			state,
			nonce,
		});

		if (authUrlResult.isErr()) {
			console.error("Failed to create Kenni authorization URL:", authUrlResult.error);
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/login?error=auth_setup_failed",
				},
			});
		}

		// Add next parameter and code verifier to state for post-login redirect
		const authUrlWithNext = new URL(authUrlResult.value);
		authUrlWithNext.searchParams.set(
			"state",
			`${state}:${encodeURIComponent(nextUrl)}:${codeVerifier}`,
		);

		// Redirect to Kenni for authentication
		return new Response(null, {
			status: 302,
			headers: {
				Location: authUrlWithNext.toString(),
			},
		});
	},
});
