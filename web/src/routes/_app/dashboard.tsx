import { createFileRoute } from "@tanstack/react-router";

import { Heading } from "~/components/ui/heading";
import { requireServerUser } from "~/lib/server-auth";

function DashboardPage() {
  const { user } = Route.useLoaderData();

  return (
    <div>
      <Heading>Dashboard</Heading>

      <div className="mt-8 grid gap-6">
        {/* User Info Card */}
        <div className="rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">User Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <span className="font-medium text-zinc-700">Name:</span>
              <p className="text-zinc-900">{user.fullName}</p>
            </div>
            <div>
              <span className="font-medium text-zinc-700">Role:</span>
              <p className="capitalize text-zinc-900">{user.role}</p>
            </div>
            <div>
              <span className="font-medium text-zinc-700">User ID:</span>
              <p className="font-mono text-sm text-zinc-900">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/dashboard")({
  loader: async () => {
    // This will redirect to login if not authenticated
    const { session, user } = await requireServerUser({ data: "/dashboard" });
    return { session, user };
  },
  component: DashboardPage,
});
