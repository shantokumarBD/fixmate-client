import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ROUTES } from "@/constants/routes";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export async function DashboardAuthGuard({
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