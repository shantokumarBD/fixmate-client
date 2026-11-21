import React from "react";
import { Search, FileText, Wrench, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Find a Service",
      description:
        "Browse categorized workshop manifests or describe your device fault for instant upfront pricing.",
      phase: "PHASE 1: INSTANT QUOTE",
      isHighlighted: false,
    },
    {
      number: "02",
      icon: FileText,
      title: "Send a Request",
      description:
        "Pick home doorstep visit or authorized shop drop-off, and lock in a convenient technician time slot.",
      phase: "PHASE 2: SLOT DISPATCH",
      isHighlighted: false,
    },
    {
      number: "03",
      icon: Wrench,
      title: "Technician Fixes It",
      description:
        "Verified technician inspects, repairs with OEM-grade parts, and records step-by-step diagnostic proof.",
      phase: "PHASE 3: WORKSHOP BENCH",
      isHighlighted: false,
    },
    {
      number: "04",
      icon: ShieldCheck,
      title: "Pay After Completion",
      description:
        "Inspect the repaired device, test all functions, and release payment only when 100% satisfied.",
      phase: "PHASE 4: 90-DAY WARRANTY ACTIVATED",
      isHighlighted: true,
    },
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-24 border-b-2 border-[#151515]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-[#F5F0E6] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-3.5 py-1.5 rounded-[6px] font-mono text-xs font-bold text-[#151515] mb-3">
            [ STANDARD OPERATING PROCEDURE ]
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-[#151515] tracking-tight">
            How FixMate Works
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#151515]/80 mt-3 font-medium">
            Four simple steps from hardware fault to fully certified fix. No upfront fees.
          </p>
        </div>

        {/* 4 Connected Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform ${
                  step.isHighlighted ? "bg-[#FF5B2E] text-[#151515]" : "bg-[#F5F0E6] text-[#151515]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`font-mono text-2xl font-black border-2 border-[#151515] px-3 py-1 rounded-[6px] shadow-[2px_2px_0px_#151515] ${
                        step.isHighlighted ? "bg-white text-[#151515]" : "bg-[#FCD03D] text-[#151515]"
                      }`}
                    >
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-[8px] bg-white border-2 border-[#151515] flex items-center justify-center shadow-[2px_2px_0px_#151515]">
                      <Icon className="w-5 h-5 text-[#151515]" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-[#151515]">
                    {step.title}
                  </h3>
                  <p
                    className={`font-sans text-xs sm:text-sm mt-2.5 leading-relaxed ${
                      step.isHighlighted ? "text-[#151515] font-medium" : "text-[#151515]/85"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                <div
                  className={`mt-6 pt-4 border-t-2 border-dashed border-[#151515] font-mono text-[11px] ${
                    step.isHighlighted ? "font-bold text-[#151515]" : "text-[#151515]/70 font-semibold"
                  }`}
                >
                  {step.phase}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}