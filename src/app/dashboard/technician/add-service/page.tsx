import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { AddServiceForm } from "@/components/forms/AddServiceForm";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add New Repair Service | FixMate",
};

export default async function AddServicePage() {
  await requireRole("technician");

  return (
    <div className="space-y-6 pb-16 w-full">
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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-[6px] shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Services</span>
        </Link>
      </div>

      {/* 2-Column Responsive Workbench Grid (Eliminates Right Gap & Overflow) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Service Creation Form (8 Columns) */}
        <div className="lg:col-span-8">
          <AddServiceForm />
        </div>

        {/* Right Column: Workshop Guidelines & Policy Sidebar (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Moderation Checklist Card */}
          <div className="bg-[#FEF9EF] border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-[4px] bg-[#FCD03D] border-2 border-[#151515] flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_#151515]">
                📋
              </div>
              <h3 className="font-heading font-extrabold text-sm uppercase text-[#151515] tracking-tight">
                Moderation Checklist
              </h3>
            </div>

            <ul className="space-y-2.5 font-sans text-xs text-[#5B403A]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#151515]">Inspection Quote:</strong> Set a realistic base diagnosis fee covering initial teardown.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#151515]">Coverage Precision:</strong> Specify clear operational areas (e.g., Gulshan, Dhanmondi, Uttara).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#151515]">Clear Scope:</strong> Describe supported repair types, equipment used, and customer guarantees.
                </span>
              </li>
            </ul>
          </div>

          {/* Escrow & Payment Guarantee Card */}
          <div className="bg-white border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515]">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#FF5B2E]" />
              <h4 className="font-heading font-bold text-xs uppercase text-[#151515]">
                FixMate Escrow Model
              </h4>
            </div>
            <p className="font-sans text-xs text-[#5B403A] leading-relaxed">
              Customers pay <strong>$0 upfront</strong>. Once you diagnose and complete the job, the customer approves the invoice and settles securely via Stripe.
            </p>
          </div>

          {/* Pro Tip Card */}
          <div className="bg-[#151515] text-[#F5F0E6] border-2 border-[#151515] rounded-[10px] p-4 shadow-[4px_4px_0px_#FF5B2E]">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#FCD03D]" />
              <span className="font-mono text-[11px] font-bold uppercase text-[#FCD03D]">
                PRO TECHNICIAN TIP
              </span>
            </div>
            <p className="font-sans text-xs text-[#DEDAD0] leading-relaxed">
              Listing your service with high-resolution photos increases customer booking conversions by up to <strong>65%</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}