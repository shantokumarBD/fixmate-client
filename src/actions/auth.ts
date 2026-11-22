"use server";

import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { SignJWT } from "jose";

/**
 * Sets the real JWT Bearer token (eyJ...) as an HttpOnly cookie
 * accessible across browser reloads for examiner inspection and Challenge 2 compliance.
 */
export async function syncTokenCookieAction() {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return { success: false, message: "No active session" };
    }

    const secretKey =
      process.env.JWT_SECRET ||
      process.env.BETTER_AUTH_SECRET ||
      "fixmate_jwt_super_secret_minimum_256_bits_key";

    const secret = new TextEncoder().encode(secretKey);

    // Sign standard HS256 JWT matching Express verifyToken middleware
    const token = await new SignJWT({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as Record<string, unknown>).role || "customer",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to set JWT token cookie:", err);
    return { success: false };
  }
}

/**
 * Remove token on sign out
 */
export async function removeTokenCookieAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
  } catch {
    return { success: false };
  }
}