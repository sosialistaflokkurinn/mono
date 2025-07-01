import { createFileRoute } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";

function LoginPage() {
  const search = Route.useSearch();
  const next: string = 
    typeof search["next"] === "string" ? decodeURIComponent(search["next"]) : "/";

  const handleKenniAuth = async () => {
    // For now, redirect to a placeholder URL
    // This will be replaced with proper server function once API routes are migrated
    window.location.href = `/api/auth/login?next=${encodeURIComponent(next)}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Heading
            level={2}
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Innskráning
          </Heading>
          <p className="mt-2 text-sm text-gray-600">
            Skráðu þig inn með Kenni rafrænum skilríkjum
          </p>
          {next && (
            <p className="mt-1 text-xs text-gray-500">
              Þú verður sendur á {next} eftir innskráningu
            </p>
          )}
        </div>

        <div className="mt-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleKenniAuth();
            }}
          >
            <Button type="submit" className="w-full">
              Kenni Auðkenni
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">
                  Öruggt og þægilegt
                </span>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              Kenni tryggir öryggi og næði þinna persónuupplýsinga
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: search["next"] as string | undefined,
  }),
  component: LoginPage,
});