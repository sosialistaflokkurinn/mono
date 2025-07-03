import { createServerFileRoute } from "@tanstack/react-start/server";

import { destroySession } from "~/lib/jwt-session";

export const ServerRoute = createServerFileRoute("/api/auth/logout").methods({
	POST: async () => {
		// Destroy the session
		await destroySession();

		// Redirect to login page
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/login",
			},
		});
	},
});
