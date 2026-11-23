import { headers, cookies } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (err: unknown) {
    if ((err as Error)?.message === "NEXT_REDIRECT") throw err;

    console.error("[Session Read Warning]: Database latency or network issue", err);
    throw new Error("Auth session delayed: database is waking up. Please retry.");
  }
};

/**
 * Safe Session Lookup for public and auth pages (never throws)
 */
export const getSessionSafe = async () => {
  try {
    return await getSession();
  } catch {
    return null;
  }
};

/**
 * Retries getSession up to 2 times if a session cookie exists but DB has latency
 */
export const getSessionWithRetry = async () => {
  const cookieStore = await cookies();
  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
    cookieStore.has(name)
  );

  let lastError: unknown = null;

  for (let attempt = 0; attempt < (hasSessionCookie ? 3 : 1); attempt++) {
    try {
      const session = await getSession();
      if (session?.user) return session;
      if (!hasSessionCookie) return null;
    } catch (err: unknown) {
      if ((err as Error)?.message === "NEXT_REDIRECT") throw err;
      lastError = err;
      if (!hasSessionCookie) throw err;
    }

    if (attempt < 2 && hasSessionCookie) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
};

export const requireRole = async (allowedRole: string | string[]) => {
  const session = await getSessionWithRetry();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userRole = (
    ((session.user as Record<string, unknown>).role as string) || "customer"
  ).toLowerCase();
  const roles = (Array.isArray(allowedRole) ? allowedRole : [allowedRole]).map((r) =>
    r.toLowerCase()
  );

  if (!roles.includes(userRole)) {
    if (userRole === "admin") redirect("/dashboard/admin");
    if (userRole === "technician") redirect("/dashboard/technician");
    if (userRole === "customer") redirect("/dashboard/customer");
    redirect("/");
  }

  return session;
};

export const getToken = async () => {
  const session = await getSessionWithRetry();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }
  const secretKey = process.env.JWT_SECRET;
  const secret = new TextEncoder().encode(secretKey);
  return await new SignJWT({
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: (session.user as Record<string, unknown>).role || "customer",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

/**
 * Resilient Server Fetcher:
 * - 20s timeout per attempt for GET with 1 retry (matches Render 30-40s wake up comfortably under Vercel 300s limit)
 * - ZERO retries on mutations (POST, PUT, PATCH, DELETE) to prevent duplicates
 * - Strict 401 redirect guard
 */
export const authFetch = async (
  url: string,
  options: RequestInit = {},
  retries = 1,
  delayMs = 1500
): Promise<Response> => {
  const token = await getToken();
  const method = (options.method || "GET").toUpperCase();
  const isIdempotent = method === "GET" || method === "HEAD";
  const maxAttempts = isIdempotent ? retries : 0; // ZERO retries for mutations!
  const timeoutMs = 20000; // 20s per attempt

  for (let attempt = 0; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      // 1. Strict 401 guard: Only authentic 401 redirects to sign-in
      if (res.status === 401) {
        redirect("/sign-in");
      }

      // 2. Retry on 5xx cold-start gateways ONLY for idempotent reads
      if (res.status >= 500 && attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }

      return res;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if ((err as Error)?.message === "NEXT_REDIRECT") throw err;

      // Retry on network drops or timeouts ONLY for idempotent reads
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }

      const isAbort = (err as Error)?.name === "AbortError";
      const isNetwork =
        (err as Error)?.message?.includes("fetch failed") ||
        (err as Error)?.message?.includes("ECONNREFUSED");
      throw new Error(
        isAbort
          ? "Backend request timed out while server was waking up."
          : isNetwork
          ? "Network error. Please try again later."
          : (err as Error)?.message || "Network error. Please try again later."
      );
    }
  }

  throw new Error("Service temporarily unavailable after retries.");
};