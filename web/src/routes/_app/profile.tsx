"use client";

import { createFileRoute } from "@tanstack/react-router";

import { Heading } from "~/components/ui/heading";

// import { useAuth, useUserInitials } from "~/lib/auth-provider";

function ProfilePage() {
  // TODO: Re-enable authentication hooks
  // const { user, isAuthenticated } = useAuth();
  // const userInitials = useUserInitials();

  // Placeholder data for now
  const user = { name: "Test User", role: "user", userId: "test-id-123" };
  const isAuthenticated = true;
  const userInitials = "TU";

  if (!isAuthenticated || !user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <Heading>Profile</Heading>

      <div className="mt-8 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-lg font-medium text-zinc-600">
            {userInitials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">{user.name}</h2>
            <p className="capitalize text-zinc-600">{user.role}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Account Details</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-zinc-700">
                Full Name
              </span>
              <p className="text-zinc-900">{user.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-700">Role</span>
              <p className="capitalize text-zinc-900">{user.role}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-700">User ID</span>
              <p className="font-mono text-sm text-zinc-900">{user.userId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});
