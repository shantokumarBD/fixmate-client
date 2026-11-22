// File: src/app/dashboard/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ROUTES } from "@/constants/routes";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Workbench Dashboard | FixMate",
  description: "Manage your smart device repair tickets, technician manifests, and payments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect(ROUTES.SIGN_IN);
  }

  const user = {
    id: session.user.id,
    name: session.user.name || "FixMate User",
    email: session.user.email || "",
    image: session.user.image || null,
    role: ((session.user as Record<string, unknown>).role as string) || "customer",
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}