import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { AddServiceForm } from "@/components/forms/AddServiceForm";
import { ArrowLeft, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add New Repair Service | FixMate",
};

export default async function AddServicePage() {
  await requireRole("technician");

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      {/* Station Header */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              STATION 02 // WORKSHOP CATALOG
            </span>
            <span className="font-mono text-xs text-[#5B403A]">MANUAL INTAKE</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            Add New Repair Service
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Specify technical diagnosis parameters, starting quotation rates, and coverage zones.
          </p>
        </div>

        <Link
          href={ROUTES.TECHNICIAN.MY_SERVICES}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] rounded-[6px] shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Services</span>
        </Link>
      </div>

      {/* Render Service Creation Form */}
      <AddServiceForm />
    </div>
  );
}