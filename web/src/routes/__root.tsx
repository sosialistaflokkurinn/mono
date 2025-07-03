import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import appCss from "./globals.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title: "TanStack Start Starter" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	component: RootLayout,
	errorComponent: ({ error }) => (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Error</title>
			</head>
			<body>
				<div className="flex min-h-screen items-center justify-center bg-gray-50">
					<div className="text-center">
						<h1 className="mb-4 font-bold text-2xl text-red-600">Something went wrong</h1>
						<p className="mb-4 text-gray-600">{error?.message || "An unexpected error occurred"}</p>
						<button
							onClick={() => window.location.reload()}
							className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						>
							Reload Page
						</button>
					</div>
				</div>
			</body>
		</html>
	),
});

function RootLayout() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Outlet />
				<Scripts />
			</body>
		</html>
	);
}
