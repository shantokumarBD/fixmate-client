import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { getAllServicesForAdmin } from "@/lib/api/admin";
import { AdminServicesTable } from "@/components/dashboard/AdminServicesTable";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Service Moderation Queue | FixMate Admin",
};

export default async function AdminServicesPage() {
  
  await requireRole("admin");

  
  const services = await getAllServicesForAdmin();

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Station Header */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              OPERATOR BAY // SERVICE MODERATION
            </span>
            <span className="font-mono text-xs text-[#5B403A]">QUALITY ASSURANCE</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            Service Catalog Moderation
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Review technician technical diagnostics, inspect problem scopes, and approve or reject listings before public catalog display.
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

      {/* Interactive Service Moderation Table */}
      <AdminServicesTable services={services} />
    </div>
  );
}