import type { Metadata } from "next";
import { ShieldCheck, Wrench, Shield, CheckCircle } from "lucide-react";
import { SignUpForm } from "@/components/forms/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Join FixMate as a Customer or Technician. Verified workbench repairs and guaranteed escrow protection.",
};

export default function SignUpPage() {
  return (
    <div className="w-full max-w-5xl my-4 sm:my-8">
      {/* 2-Column Neobrutalist Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-[10px] border-2 border-[#151515] shadow-[6px_6px_0px_#151515] overflow-hidden">
        {/* LEFT COLUMN: Brand Panel (Server Rendered) */}
        <section className="md:col-span-5 bg-[#F8F3E9] p-6 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-[#151515] flex flex-col justify-between">
          <div>
            {/* Top Tag */}
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[4px] font-mono text-[11px] text-[#151515] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#151515]" />
                #FX-REGISTER // ONBOARDING
              </span>
            </div>

            {/* Headline & Description */}
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-[#151515] tracking-tight uppercase mb-2">
              Join the FixMate Network
            </h1>
            <p className="font-sans text-sm text-[#5B403A] leading-relaxed">
              Whether you need precision repair or want to dispatch your bench skills, we&apos;ve got you covered.
            </p>

            {/* Workshop Illustration Box */}
            <div className="rounded-[8px] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] bg-[#FEF9EF] p-4 my-6 flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b-2 border-dashed border-[#151515] pb-2 mb-3">
                <span className="font-mono text-[11px] text-[#5B403A] font-semibold">
                  BENCH SETUP // FIG. 014
                </span>
                <span className="font-mono text-[10px] bg-[#151515] text-[#FEF9EF] px-1.5 py-0.5 rounded-[2px] font-bold">
                  VERIFIED
                </span>
              </div>

              {/* Graphic Icon Artwork */}
              <div className="w-full h-36 flex items-center justify-center relative">
                <div className="w-20 h-20 bg-[#FF5B2E] border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[8px] flex items-center justify-center relative">
                  <Wrench className="w-10 h-10 text-[#151515]" />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#FCD03D] border-2 border-[#151515] rounded-full flex items-center justify-center shadow-[1px_1px_0px_#151515]">
                    <CheckCircle className="w-4 h-4 text-[#151515]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Points */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="bg-white border-2 border-[#151515] rounded-[8px] p-3 shadow-[2px_2px_0px_#151515] flex items-start gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#151515] text-[#FCD03D] flex items-center justify-center shrink-0 border border-[#151515]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs text-[#151515] leading-tight uppercase">
                  Escrow Payment Protection
                </h3>
                <p className="font-mono text-[11px] text-[#5B403A] mt-0.5 leading-snug">
                  Funds held safely until post-bench inspection QA pass.
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-[#151515] rounded-[8px] p-3 shadow-[2px_2px_0px_#151515] flex items-start gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#FF5B2E] text-[#151515] flex items-center justify-center shrink-0 border border-[#151515]">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs text-[#151515] leading-tight uppercase">
                  Vetted Bench Technicians
                </h3>
                <p className="font-mono text-[11px] text-[#5B403A] mt-0.5 leading-snug">
                  Hardware certified diagnostics &amp; component soldering.
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-[#151515] rounded-[8px] p-3 shadow-[2px_2px_0px_#151515] flex items-start gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#FCD03D] text-[#151515] flex items-center justify-center shrink-0 border border-[#151515]">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs text-[#151515] leading-tight uppercase">
                  90-Day Workshop Warranty
                </h3>
                <p className="font-mono text-[11px] text-[#5B403A] mt-0.5 leading-snug">
                  Full coverage on all manufacturer parts &amp; labor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Registration Form (Client Form Island embedded in Server Container) */}
        <section className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-[#151515] tracking-tight uppercase mb-1">
              Create an Account
            </h2>
            <p className="font-sans text-sm text-[#5B403A]">
              Select your role and enter your workbench credentials.
            </p>
          </div>

          {/* Client Form Component */}
          <SignUpForm />
        </section>
      </div>
    </div>
  );
}