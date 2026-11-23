"use client";

import React, { useEffect, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("FixMate Telemetry Glitch:", error);
  }, [error]);

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="min-h-screen bg-[#FEF9EF] flex flex-col justify-center items-center p-4 selection:bg-[#FF5B2E] selection:text-[#151515]">
      <div className="w-full max-w-md bg-white border-2 border-[#151515] rounded-[10px] shadow-[6px_6px_0px_#151515] overflow-hidden">
        {/* Header Strip */}
        <div className="bg-[#FF5B2E] text-white px-4 py-2.5 border-b-2 border-[#151515] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white border border-[#151515]"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              DIAGNOSTIC SYSTEM FAULT
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold bg-[#151515] text-white px-1.5 py-0.5 rounded">
            ERR_500
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FEF9EF] border-2 border-[#151515] flex items-center justify-center shadow-[3px_3px_0px_#151515]">
            <AlertTriangle className="w-7 h-7 text-[#FF5B2E]" />
          </div>

          <div>
            <h2 className="font-heading font-extrabold text-xl text-[#151515]">
              Workbench Interrupted
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] mt-1.5 leading-relaxed">
              This station failed to load due to an operational interruption. Please click the retry button below to reload the view.
            </p>
          </div>

          {error.digest && (
            <div className="p-2 bg-[#FEF9EF] border border-[#151515] rounded font-mono text-[10px] text-[#5B403A] text-left break-all">
              <span className="font-bold text-[#151515]">INCIDENT DIGEST:</span> {error.digest}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-[#151515]">
            <button
              onClick={handleRetry}
              className="py-2.5 px-3 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-[6px] inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Station</span>
            </button>

            <Link
              href={ROUTES.HOME}
              className="py-2.5 px-3 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] rounded-[6px] inline-flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Safe Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}