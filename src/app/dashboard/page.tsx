import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ROUTES } from "@/constants/routes";

export default async function DashboardRootPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect(ROUTES.SIGN_IN);
  }

  const role = ((session.user as Record<string, unknown>).role as string) || "customer";

  if (role === "admin") {
    redirect(ROUTES.ADMIN.OVERVIEW);
  }
  if (role === "technician") {
    redirect(ROUTES.TECHNICIAN.OVERVIEW);
  }

  redirect(ROUTES.CUSTOMER.OVERVIEW);
}