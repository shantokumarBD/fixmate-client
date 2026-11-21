import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="max-w-2xl mx-auto py-12 flex flex-col items-center text-center">
      <div className="w-full bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-[#FCD03D] px-6 py-3 border-b-2 border-[#151515] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#151515]"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
              DISPATCH BAY // STATUS_404
            </span>
          </div>
          <span className="font-mono text-[10px] bg-white border border-[#151515] px-2 py-0.5 font-bold uppercase">
            STATION UNKNOWN
          </span>
        </div>

        {/* Ticket Body */}
        <div className="p-8 sm:p-12 flex flex-col items-center">
          <div className="w-14 h-14 bg-[#FF5B2E] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-4">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>

          <h2 className="font-heading font-extrabold text-2xl text-[#151515] tracking-tight">
            Workbench Module Not Found
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-md mt-2 mb-6">
            The requested technical terminal path could not be located in this workshop bay.
          </p>

          <Link
            href={ROUTES.CUSTOMER.OVERVIEW}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#151515] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#242424] transition-all rounded-[6px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}