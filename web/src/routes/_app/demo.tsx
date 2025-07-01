"use client";

import { createFileRoute } from "@tanstack/react-router";

import { ContactForm } from "~/components/contact-form";
import { Heading } from "~/components/ui/heading";
// import { useAuth, useUserInitials } from "~/lib/auth-provider";

function DemoPage() {
  // TODO: Re-enable authentication hooks
  // const { user, isAuthenticated, logout } = useAuth();
  // const userInitials = useUserInitials();
  
  // Placeholder data for now
  const user = { name: "Test User", role: "user" };
  const isAuthenticated = true;
  const userInitials = "TU";
  const logout = () => console.log("logout");

  if (!isAuthenticated || !user) {
    return (
      <div>Not authenticated - this should not happen in the (app) layout</div>
    );
  }

  return (
    <div className="space-y-8">
      <Heading>React 19 Auth Demo</Heading>

      <div className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Auth State</h2>
          <div className="space-y-2">
            <p>
              <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
            </p>
            <p>
              <strong>User Name:</strong> {user.name}
            </p>
            <p>
              <strong>User Role:</strong> {user.role}
            </p>
            <p>
              <strong>User Initials:</strong> {userInitials}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">TanStack Start Features</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">✅ TanStack Router</h3>
              <p className="text-sm text-zinc-600">
                File-based routing with powerful type-safe navigation
              </p>
            </div>

            <div>
              <h3 className="font-medium">✅ Server Functions</h3>
              <p className="text-sm text-zinc-600">
                Server-side logic with seamless client integration
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">✅ Vite Integration</h3>
              <p className="text-sm text-zinc-600">
                Fast development with Vite and modern build tooling
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">React Hook Form Demo</h2>
          <p className="mb-6 text-sm text-zinc-600">
            Form built with react-hook-form, Zod validation, and React Aria
            components
          </p>
          <ContactForm />
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Actions</h2>
          <div className="flex gap-2">
            <button
              onClick={logout}
              className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/demo")({
  component: DemoPage,
});