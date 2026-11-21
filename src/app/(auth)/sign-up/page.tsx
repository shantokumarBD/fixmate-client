import type { Metadata } from "next";
import { ShieldCheck, Wrench, Shield } from "lucide-react";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Join FixMate as a Customer or Technician. Verified workbench repairs and guaranteed escrow protection.",
};

export default async function SignUpPage() {

    const session = await getSession();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-4xl my-auto">
      {/* 2-Column Neobrutalist Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-[10px] border-2 border-[#151515] shadow-[6px_6px_0px_#151515] overflow-hidden">
        {/* LEFT COLUMN: Brand Panel */}
        <section className="md:col-span-5 bg-[#F8F3E9] p-4 sm:p-6 border-b-2 md:border-b-0 md:border-r-2 border-[#151515] flex flex-col justify-between">
          <div>
            {/* Top Tag */}
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[4px] font-mono text-[10px] text-[#151515] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#151515]" />
                #FX-REGISTER // ONBOARDING
              </span>
            </div>

            {/* Headline & Description */}
            <h1 className="font-heading font-extrabold text-xl md:text-2xl text-[#151515] tracking-tight uppercase mb-1">
              Join the Network
            </h1>
            <p className="font-sans text-xs text-[#5B403A] leading-relaxed">
              Precision repairs &amp; technician workbench dispatch.
            </p>

            {/* Workshop Illustration Box */}
            <div className="rounded-[8px] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] bg-[#FEF9EF] p-2.5 my-2.5 flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b-2 border-dashed border-[#151515] pb-1.5 mb-2">
                <span className="font-mono text-[10px] text-[#5B403A] font-semibold">
                  BENCH SETUP // FIG. 014
                </span>
                <span className="font-mono text-[9px] bg-[#151515] text-[#FEF9EF] px-1 py-0.5 rounded-[2px] font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="w-12 h-12 bg-[#FF5B2E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#151515]" />
              </div>
            </div>
          </div>

          {/* Trust Points */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="bg-white border border-[#151515] rounded-[6px] p-2 shadow-[1px_1px_0px_#151515] flex items-start gap-2">
              <div className="w-6 h-6 rounded-[4px] bg-[#151515] text-[#FCD03D] flex items-center justify-center shrink-0 border border-[#151515]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs text-[#151515] leading-tight uppercase">
                  Escrow Protection
                </h3>
                <p className="font-mono text-[10px] text-[#5B403A] leading-snug">
                  Funds held safely until inspection pass.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#151515] rounded-[6px] p-2 shadow-[1px_1px_0px_#151515] flex items-start gap-2">
              <div className="w-6 h-6 rounded-[4px] bg-[#FF5B2E] text-[#151515] flex items-center justify-center shrink-0 border border-[#151515]">
                <Wrench className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs text-[#151515] leading-tight uppercase">
                  Vetted Technicians
                </h3>
                <p className="font-mono text-[10px] text-[#5B403A] leading-snug">
                  Hardware certified diagnostics &amp; repair.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#151515] rounded-[6px] p-2 shadow-[1px_1px_0px_#151515] flex items-start gap-2">
              <div className="w-6 h-6 rounded-[4px] bg-[#FCD03D] text-[#151515] flex items-center justify-center shrink-0 border border-[#151515]">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xs text-[#151515] leading-tight uppercase">
                  90-Day Warranty
                </h3>
                <p className="font-mono text-[10px] text-[#5B403A] leading-snug">
                  Full coverage on manufacturer parts &amp; labor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Registration Form */}
        <section className="md:col-span-7 p-4 sm:p-6 md:p-7 flex flex-col justify-center bg-white">
          <div className="mb-3">
            <h2 className="font-heading font-extrabold text-xl md:text-2xl text-[#151515] tracking-tight uppercase leading-none mb-1">
              Create an Account
            </h2>
            <p className="font-sans text-xs text-[#5B403A]">
              Select your role and enter workbench credentials.
            </p>
          </div>

          <SignUpForm />
        </section>
      </div>
    </div>
  );
}