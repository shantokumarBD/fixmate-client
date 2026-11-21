import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { getMyTechnicianServices } from "@/lib/api/technician";
import { TechnicianServicesTable } from "@/components/dashboard/TechnicianServicesTable";
import { PlusCircle, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Listed Services | FixMate",
};

export default async function MyServicesPage() {
  await requireRole("technician");

  // Fetch real-time technician services
  const services = await getMyTechnicianServices();

  return (
    <div className="space-y-6 pb-12">
      {/* Station Header */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              STATION 03 // SERVICE MANIFEST
            </span>
            <span className="font-mono text-xs text-[#5B403A]">OPERATIONAL BAY</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            My Repair Services
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Manage your service offerings, toggle operational availability, and view admin approvals.
          </p>
        </div>

        <Link
          href={ROUTES.TECHNICIAN.ADD_SERVICE}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-[6px] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Interactive Technician Services Table */}
      <TechnicianServicesTable services={services} />
    </div>
  );
}