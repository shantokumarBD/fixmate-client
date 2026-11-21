import React from "react";
import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function ServiceNotFound() {
  return (
    <main className="w-full min-h-[70vh] bg-[#F5F0E6] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white border-2 border-[#151515] rounded-[10px] shadow-[6px_6px_0px_#151515] p-8 text-center">
        <div className="w-16 h-16 rounded-[8px] bg-[#FCD03D] border-2 border-[#151515] flex items-center justify-center shadow-[3px_3px_0px_#151515] mx-auto mb-4">
          <Wrench className="w-8 h-8 text-[#151515]" />
        </div>
        
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF5B2E]">
          404 Error • Dispatch Notice
        </span>

        <h1 className="font-heading font-extrabold text-2xl text-[#151515] mt-1 mb-2">
          Service Not Found
        </h1>

        <p className="font-sans text-xs sm:text-sm text-[#151515]/75 leading-relaxed mb-6">
          The requested repair manifest does not exist, has been archived, or is currently unavailable.
        </p>

        <Link
          href={ROUTES.SERVICES}
          className="inline-flex items-center gap-2 bg-[#FCD03D] text-[#151515] border-2 border-[#151515] px-4 py-2.5 rounded-[6px] font-mono text-xs font-bold shadow-[3px_3px_0px_#151515] hover:shadow-[1px_1px_0px_#151515] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Verified Services</span>
        </Link>
      </div>
    </main>
  );
}