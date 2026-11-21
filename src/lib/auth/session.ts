import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};


export const requireRole = async (allowedRole: string | string[]) => {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userRole = ((session.user as Record<string, unknown>).role as string || "customer").toLowerCase();
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
  const session = await getSession();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }
  const secretKey =
    process.env.JWT_SECRET

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


export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getToken();
  return await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};