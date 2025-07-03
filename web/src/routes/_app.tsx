import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "~/components/app-sidebar";
import { AuthLayout } from "~/components/auth-layout";

function AppLayoutComponent() {
	return (
		<AuthLayout sidebar={<AppSidebar />}>
			<Outlet />
		</AuthLayout>
	);
}

export const Route = createFileRoute("/_app")({
	component: AppLayoutComponent,
});
