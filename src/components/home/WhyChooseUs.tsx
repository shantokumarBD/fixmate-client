import React from "react";

export function WhyChooseUs() {
  const assurances = [
    {
      tag: "VETTED MASTERS",
      metric: "100%",
      title: "Verified Diagnostic Pros",
      description: "Background-checked master technicians with live diagnostic logs and verified skill credentials.",
      bgColor: "bg-[#FF5B2E]",
      textColor: "text-[#151515]",
      subColor: "text-[#151515]/80",
    },
    {
      tag: "WORKSHOP WARRANTY",
      metric: "90-Day",
      title: "Full Repair Warranty",
      description: "Zero-hassle free re-service coverage on all replaced hardware parts and technician labor.",
      bgColor: "bg-white",
      textColor: "text-[#151515]",
      subColor: "text-[#151515]/70",
    },
    {
      tag: "ESCROW MODEL",
      metric: "$0 Upfront",
      title: "Pay After Full Inspection",
      description: "No prepayment fees. Test all device functions first, and release payment only when 100% satisfied.",
      bgColor: "bg-[#FCD03D]",
      textColor: "text-[#151515]",
      subColor: "text-[#151515]/80",
    },
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-24 border-b-2 border-[#151515]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-[#F5F0E6] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-3.5 py-1.5 rounded-[6px] font-mono text-xs font-bold text-[#151515] mb-3">
            [ WORKSHOP ASSURANCE ]
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-[#151515] tracking-tight">
            Why Choose FixMate
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#151515]/80 mt-3 font-medium">
            Transparent quotes, verified workshop masters, and zero upfront risk.
          </p>
        </div>

        {/* 3 Physical Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assurances.map((item) => (
            <div
              key={item.tag}
              className={`${item.bgColor} border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform`}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]/80">
                {item.tag}
              </span>

              <div className="my-5">
                <div className="font-mono text-5xl font-black text-[#151515]">
                  {item.metric}
                </div>
                <p className="font-heading font-bold text-lg text-[#151515] mt-2 leading-snug">
                  {item.title}
                </p>
              </div>

              <span className={`font-sans text-xs ${item.subColor} leading-relaxed`}>
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}