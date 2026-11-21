import { Suspense } from "react";
import type { Metadata } from "next";
import { ShieldCheck, Wrench, Shield } from "lucide-react";
import { SignInForm } from "@/components/forms/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Log in to your FixMate customer or technician workbench account.",
};

export default function SignInPage() {
  return (
    <div className="w-full max-w-4xl my-auto">
      {/* 2-Column Neobrutalist Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-[10px] border-2 border-[#151515] shadow-[6px_6px_0px_#151515] overflow-hidden">
        {/* LEFT COLUMN: Brand Panel */}
        <section className="md:col-span-5 bg-[#F8F3E9] p-4 sm:p-6 md:border-r-2 border-b-2 md:border-b-0 border-[#151515] flex flex-col justify-between">
          <div>
            {/* Top Tag */}
            <div className="inline-flex items-center gap-1.5 bg-[#FCD03D] text-[#151515] px-2 py-0.5 rounded-[4px] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] mb-2.5">
              <span className="w-1.5 h-1.5 bg-[#151515] rounded-full inline-block" />
              <span className="font-mono text-[10px] tracking-wider uppercase font-bold">
                #FX-AUTH // WORKSHOP ACCESS
              </span>
            </div>

            {/* Heading & Subtext */}
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-[#151515] tracking-tight uppercase leading-snug">
              Welcome Back
            </h1>
            <p className="font-sans text-xs text-[#5B403A] mt-1 leading-relaxed">
              Log in to track your hardware repair manifests and technician dispatch.
            </p>

            {/* Workshop Bench Artwork Box */}
            <div className="rounded-[8px] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] bg-[#FEF9EF] p-2.5 my-3 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-[#FF5B2E] border-2 border-[#151515] rounded-[6px] flex items-center justify-center shadow-[2px_2px_0px_#151515]">
                <Wrench className="w-7 h-7 text-[#151515]" />
              </div>
              <div className="mt-1.5 text-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B403A] font-bold">
                  BENCH UNIT #04 // CALIBRATED
                </span>
              </div>
            </div>
          </div>

          {/* Trust Points */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="p-2 bg-white rounded-[6px] border border-[#151515] shadow-[1px_1px_0px_#151515] flex items-start gap-2">
              <div className="w-6 h-6 shrink-0 rounded-[4px] bg-[#FCD03D] border border-[#151515] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#151515]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs leading-tight text-[#151515] uppercase">
                  Escrow Payment Protection
                </h3>
                <p className="font-mono text-[10px] leading-tight text-[#5B403A]">
                  Funds held safely until QA pass.
                </p>
              </div>
            </div>

            <div className="p-2 bg-white rounded-[6px] border border-[#151515] shadow-[1px_1px_0px_#151515] flex items-start gap-2">
              <div className="w-6 h-6 shrink-0 rounded-[4px] bg-[#FF5B2E] border border-[#151515] flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs leading-tight text-[#151515] uppercase">
                  Vetted Technicians
                </h3>
                <p className="font-mono text-[10px] leading-tight text-[#5B403A]">
                  Hardware certified diagnostics.
                </p>
              </div>
            </div>

            <div className="p-2 bg-white rounded-[6px] border border-[#151515] shadow-[1px_1px_0px_#151515] flex items-start gap-2">
              <div className="w-6 h-6 shrink-0 rounded-[4px] bg-[#FEF9EF] border border-[#151515] flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-[#151515]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs leading-tight text-[#151515] uppercase">
                  90-Day Warranty
                </h3>
                <p className="font-mono text-[10px] leading-tight text-[#5B403A]">
                  Full coverage on parts &amp; labor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Authentication Form */}
        <section className="md:col-span-7 p-5 sm:p-6 md:p-8 flex flex-col justify-center bg-white">
          <div className="border-b-2 border-[#151515] pb-2.5 mb-4">
            <h2 className="font-heading font-extrabold text-xl md:text-2xl text-[#151515] font-bold leading-none tracking-tight uppercase">
              Sign In
            </h2>
            <p className="font-sans text-xs text-[#5B403A] mt-1">
              Access your customer or technician workbench account.
            </p>
          </div>

          <Suspense fallback={<div className="font-mono text-xs text-[#5B403A]">Loading...</div>}>
            <SignInForm />
          </Suspense>
        </section>
      </div>
    </div>
  );
}