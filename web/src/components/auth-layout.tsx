import type { ReactNode } from "react";

import { AuthProvider } from "~/lib/auth-provider";
import { getServerUser } from "~/lib/server-auth";

import { AuthNavbar } from "./auth-navbar.tsx";
import { StackedLayout } from "./ui/stacked-layout.tsx";

interface AuthLayoutProps {
	children: ReactNode;
	sidebar?: ReactNode;
}

/**
 * Layout component for authenticated sections
 */
export async function AuthLayout({ children, sidebar }: AuthLayoutProps) {
	const serverUser = await getServerUser();

	return (
		<AuthProvider initialUser={serverUser}>
			<StackedLayout navbar={<AuthNavbar />} sidebar={sidebar}>
				{children}
			</StackedLayout>
		</AuthProvider>
	);
}
