import type { ReactNode } from "react";

import { AuthProvider } from "~/lib/auth-provider";
// import { getServerUser } from "~/lib/server-auth";

import { AuthNavbar } from "./auth-navbar";
import { StackedLayout } from "./ui/stacked-layout";

interface AuthLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

/**
 * Layout component for authenticated sections
 * TODO: Re-enable server-side auth fetching
 */
export function AuthLayout({ children, sidebar }: AuthLayoutProps) {
  // TODO: Fetch user data on the server
  // const serverUser = await getServerUser();
  const serverUser = null; // Placeholder

  return (
    <AuthProvider initialUser={serverUser}>
      <StackedLayout navbar={<AuthNavbar />} sidebar={sidebar}>
        {children}
      </StackedLayout>
    </AuthProvider>
  );
}
