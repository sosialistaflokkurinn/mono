import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db, User } from "@xj/db";
import { safeZodParse } from "@xj/utils";
import { eq } from "drizzle-orm";

import { getSession, sessionSchema } from "./jwt-session";

export interface ServerUser {
  userId: string;
  name: string;
  role: "user" | "admin";
}

function redirectToLogin(currentPath?: string): never {
  const loginUrl = currentPath
    ? `/login?next=${encodeURIComponent(currentPath)}`
    : "/login";

  // Use TanStack Router's redirect pattern
  throw redirect({
    to: loginUrl,
  });
}

/**
 * Server-side function to require authentication with validation
 * Redirects to login if not authenticated or session invalid
 */
async function requireServerAuth(currentPath?: string): Promise<ServerUser> {
  const sessionResult = await getSession();

  if (sessionResult.isErr()) {
    redirectToLogin(currentPath);
    return {} as never; // This line will never execute due to redirect throw
  }

  const session = sessionResult.value;

  // Re-validate session data with safeZodParse for extra safety
  const validationResult = safeZodParse(sessionSchema)(session);
  if (validationResult.isErr()) {
    validationResult.orTee((validationError) => {
      // TODO: Re-enable Sentry error capturing
      // Sentry.captureException(new Error("Session validation failed"), {
      //   extra: { validationError, currentPath },
      // });
      console.error("Session validation failed:", validationError);
    });
    redirectToLogin(currentPath);
    return {} as never; // This line will never execute due to redirect throw
  }
  const validatedSession = validationResult.value;

  // TODO: Re-enable Sentry user context
  // Sentry.setUser({
  //   id: validatedSession.userId,
  //   username: validatedSession.name,
  // });

  return {
    userId: validatedSession.userId,
    name: validatedSession.name,
    role: validatedSession.role,
  };
}

/**
 * Server function to get current user data
 */
export const getServerUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const sessionResult = await getSession();

    if (sessionResult.isErr()) {
      return null;
    }

    const session = sessionResult.value;

    return {
      userId: session.userId,
      name: session.name,
      role: session.role,
    };
  },
);

/**
 * Server function to require authentication and return user from database
 * Redirects to login if not authenticated
 */
export const requireServerUser = createServerFn({ method: "GET" })
  .validator((currentPath?: string) => currentPath)
  .handler(async ({ data }: { data?: string }) => {
    const session = await requireServerAuth(data);

    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.id, session.userId))
      .limit(1);

    if (!user) {
      redirectToLogin(data);
      return {} as never; // This line will never execute due to redirect throw
    }

    // TODO: Re-enable Sentry user context
    // Sentry.setUser({
    //   id: session.userId,
    //   username: session.name,
    //   email: user.email || undefined,
    // });

    return { session, user };
  });

/**
 * Server function to require admin role and return user from database
 * Redirects to login if not authenticated or not admin
 */
export const requireServerAdminUser = createServerFn({ method: "GET" })
  .validator((currentPath?: string) => currentPath)
  .handler(async ({ data }: { data?: string }) => {
    const session = await requireServerAuth(data);

    if (session.role !== "admin") {
      redirectToLogin(data);
      return {} as never; // This line will never execute due to redirect throw
    }

    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.id, session.userId))
      .limit(1);

    if (!user) {
      redirectToLogin(data);
      return {} as never; // This line will never execute due to redirect throw
    }

    // TODO: Re-enable Sentry user context for admin
    // Sentry.setUser({
    //   id: session.userId,
    //   username: session.name,
    //   email: user.email || undefined,
    // });

    return { session, user };
  });
