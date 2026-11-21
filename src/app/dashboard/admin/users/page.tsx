import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole, getSession } from "@/lib/auth/session";
import { getAllUsers } from "@/lib/api/admin";
import { AdminUsersTable } from "@/components/dashboard/AdminUsersTable";
import { ArrowLeft, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "User Management | FixMate Admin",
};

export default async function AdminUsersPage() {
  
  await requireRole("admin");
  const session = await getSession();

  
  const users = await getAllUsers();

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Station Header */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              SECURITY // RBAC DIRECTORY
            </span>
            <span className="font-mono text-xs text-[#5B403A]">USER ECOSYSTEM</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            User Management Directory
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Audit registered customer and technician accounts, search user identities, and reassign system permissions.
          </p>
        </div>

        <Link
          href={ROUTES.ADMIN.OVERVIEW}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] rounded-[6px] shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Admin Console</span>
        </Link>
      </div>

      {/* Interactive Users Table with RBAC Role Switcher */}
      <AdminUsersTable
        users={users}
        currentUserEmail={session?.user?.email || ""}
      />
    </div>
  );
}