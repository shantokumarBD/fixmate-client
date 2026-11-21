import React from "react";
import Image from "next/image";
import { Search, ChevronDown, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/constants/roles";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full border-b-2 border-[#151515] bg-[#F5F0E6] relative overflow-hidden bg-dots">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Official Design Copy & Interactive Search */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top Specification Badge */}
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold bg-white border-2 border-[#151515] px-3.5 py-1.5 rounded-[6px] shadow-[2px_2px_0px_#151515] mb-6 text-[#151515]">
              <span className="w-2 h-2 rounded-full bg-[#FF5B2E] inline-block" />
              <span>[ WORKSHOP SPEC 2025 // ON-DEMAND REPAIR NETWORK ]</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-[56px] lg:leading-[60px] text-[#151515] tracking-tight mb-6">
              Broken Device? Get It Fixed by{" "}
              <span className="bg-[#FCD03D] px-2 py-0.5 border-2 border-[#151515] inline-block shadow-[3px_3px_0px_#151515] rounded-[6px]">
                Verified
              </span>{" "}
              Technicians
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-sm sm:text-base text-[#151515] mb-6 max-w-xl font-medium leading-relaxed">
              Book certified technicians for smartphones, laptops, ACs, refrigerators and home electricals. Transparent quotes, real-time diagnostic logs, and you pay only after completion.
            </p>

            {/* Search Box Ticket Container (HireLoop Pure Native Form) */}
            <form
              action="/services"
              method="GET"
              className="w-full max-w-2xl bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-2.5 mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              {/* Search Query Input */}
              <div className="flex items-center gap-2.5 flex-1 px-3 py-2 bg-[#F5F0E6] rounded-[6px] border-2 border-[#151515]">
                <Search className="w-4 h-4 text-[#151515] shrink-0 font-bold" />
                <input
                  name="search"
                  type="text"
                  placeholder="Search device, issue, or model (e.g. iPhone 14 screen, Daikin AC gas leak...)"
                  className="w-full bg-transparent font-sans text-xs text-[#151515] placeholder-[#151515]/60 outline-none border-none font-medium"
                />
              </div>

              {/* Category Dropdown (Direct from Central Constants) */}
              <div className="relative shrink-0">
                <select
                  name="category"
                  defaultValue=""
                  className="w-full appearance-none bg-white border-2 border-[#151515] rounded-[6px] font-mono text-xs font-semibold text-[#151515] px-4 py-2.5 pr-8 focus:outline-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#151515]" />
              </div>

              {/* Submit Button */}
              <Button type="submit" size="md" className="shrink-0 whitespace-nowrap">
                <span>Search repairs</span>
                <ArrowRight className="w-4 h-4 text-[#151515]" />
              </Button>
            </form>

            {/* Trust Badges Under Search */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 text-[#151515] font-mono text-xs font-bold">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#151515] text-[#F5F0E6] flex items-center justify-center text-[10px]">
                  ✓
                </span>
                100% Free Diagnostics
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#151515] text-[#F5F0E6] flex items-center justify-center text-[10px]">
                  ✓
                </span>
                90-Day Workshop Warranty
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#151515] text-[#F5F0E6] flex items-center justify-center text-[10px]">
                  ✓
                </span>
                Zero Pre-payments
              </span>
            </div>
          </div>

          {/* Right Column: Workshop Visual Card with Offset Block */}
          <div className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-[420px]">
              {/* Offset Safety Orange Solid Under-block */}
              <div className="absolute inset-0 bg-[#FF5B2E] rounded-[10px] border-2 border-[#151515] translate-x-2.5 translate-y-2.5" />

              {/* Foreground Card */}
              <div className="relative bg-white border-2 border-[#151515] rounded-[10px] p-3 shadow-[4px_4px_0px_#151515] overflow-hidden">
                <div className="relative w-full aspect-square border-2 border-[#151515] rounded-[8px] overflow-hidden bg-[#dedad0]">
                  <Image
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                    alt="FixMate Master Technician inspecting diagnostics"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Pinned Job Ticket Manifest Strip */}
                <div className="mt-3 p-2.5 bg-[#F5F0E6] border-2 border-[#151515] rounded-[6px] flex items-center justify-between font-mono text-[11px] text-[#151515]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#FF5B2E] border border-[#151515] rounded-full animate-ping" />
                    <span className="font-bold">JOB TICKET #FX-902</span>
                  </div>
                  <span className="font-bold bg-[#FCD03D] px-2 py-0.5 border border-[#151515] rounded text-[10px]">
                    TESTED &amp; READY
                  </span>
                </div>
              </div>

              {/* Floating Sticker 1: Top Left */}
              <div className="absolute -top-4 -left-3 sm:-left-6 bg-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] rounded-[8px] px-3.5 py-2 flex items-center gap-1.5 font-mono text-xs font-bold text-[#151515] -rotate-3 z-10">
                <ShieldCheck className="w-4 h-4 text-[#FF5B2E]" />
                <span>Pay after job is done</span>
              </div>

              {/* Floating Sticker 2: Bottom Right */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-[#FCD03D] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] rounded-[8px] px-3.5 py-2 flex items-center gap-1.5 font-mono text-xs font-bold text-[#151515] rotate-2 z-10">
                <Zap className="w-4 h-4 text-[#151515]" />
                <span>Verified pros (Avg. 4.9★)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}