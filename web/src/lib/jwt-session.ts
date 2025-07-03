import { hmac } from "@oslojs/crypto/hmac";
import { SHA256 } from "@oslojs/crypto/sha2";
import { constantTimeEqual } from "@oslojs/crypto/subtle";
import {
  createJWTSignatureMessage,
  encodeJWT,
  joseAlgorithmHS256,
  JWSRegisteredHeaders,
  JWTRegisteredClaims,
  parseJWT,
} from "@oslojs/jwt";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";
import { safeZodParse } from "@xj/utils";
import { err, ok } from "neverthrow";
import { z } from "zod";

import { env } from "./env";

export const sessionSchema = z.object({
  userId: z.string(),
  name: z.string(),
  role: z.enum(["user", "admin"]),
  // JWT standard claims
  iat: z.number(), // Issued at
  exp: z.number(), // Expires at
  sub: z.string(), // Subject (userId)
});

type SessionData = z.infer<typeof sessionSchema>;

// Session cookie configuration
const COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Create a JWT token for session data
 */
function createJWT(payload: Omit<SessionData, "iat" | "exp" | "sub">): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + COOKIE_MAX_AGE;

  const header = JSON.stringify({ alg: joseAlgorithmHS256 });
  const fullPayload = JSON.stringify({
    ...payload,
    sub: payload.userId,
    iat: now,
    exp,
  });

  const secretKey = new TextEncoder().encode(env.JWT_SECRET);
  const signatureMessage = createJWTSignatureMessage(header, fullPayload);
  const signature = hmac(SHA256, secretKey, signatureMessage);

  return encodeJWT(header, fullPayload, signature);
}

/**
 * Verify JWT signature using HMAC-SHA256
 */
function verifyJWTSignature(token: string): boolean {
  try {
    const [header, , signature, signatureMessage] = parseJWT(token);

    const headerParameters = new JWSRegisteredHeaders(header);
    if (headerParameters.algorithm() !== joseAlgorithmHS256) {
      return false;
    }

    const secretKey = new TextEncoder().encode(env.JWT_SECRET);
    const expectedSignature = hmac(SHA256, secretKey, signatureMessage);

    return (
      expectedSignature.length === signature.length &&
      constantTimeEqual(expectedSignature, signature)
    );
  } catch {
    return false;
  }
}

/**
 * Parse and validate session JWT token
 */
function parseSessionToken(token: string) {
  try {
    // Verify signature first
    if (!verifyJWTSignature(token)) {
      return err({ type: "invalid_signature" });
    }

    // Parse JWT using Oslo
    const [, payload] = parseJWT(token);

    // Check expiration using Oslo's JWTRegisteredClaims
    const claims = new JWTRegisteredClaims(payload);
    if (!claims.verifyExpiration()) {
      return err({ type: "expired_token" });
    }

    // Validate payload structure using safeZodParse
    const sessionResult = safeZodParse(sessionSchema)(payload);
    if (sessionResult.isErr()) {
      return err({ type: "malformed_payload" });
    }

    const session = sessionResult.value;

    // Check if token is used too early (clock skew protection)
    const now = Math.floor(Date.now() / 1000);
    if (session.iat > now + 60) {
      // Allow 60 seconds clock skew
      return err({ type: "invalid_token" });
    }

    return ok(session);
  } catch {
    return err({ type: "invalid_token" });
  }
}

/**
 * Get current session from cookies
 */
export async function getSession() {
  const sessionCookie = getCookie(COOKIE_NAME);
  if (!sessionCookie) {
    return err({ type: "no_session" } as const);
  }
  return parseSessionToken(sessionCookie);
}

/**
 * Create a new session and set cookie
 */
export async function createSession(userData: {
  userId: string;
  name: string;
  role: "user" | "admin";
}) {
  const token = createJWT(userData);

  setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return { success: true };
}

/**
 * Destroy session by clearing cookie
 */
export async function destroySession() {
  deleteCookie(COOKIE_NAME);
  return { success: true };
}
