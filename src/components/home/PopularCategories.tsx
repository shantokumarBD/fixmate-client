import React from "react";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Wind,
  Snowflake,
  Tv,
  Disc,
  Zap,
  ArrowRight,
} from "lucide-react";
import { ServiceCategory } from "@/constants/roles";
import { getCategoryCounts } from "@/lib/api/services";

export async function PopularCategories() {
  const categoryCounts = await getCategoryCounts();

  const categoryConfig: {
    category: ServiceCategory;
    label: string;
    description: string;
    icon: React.ElementType;
    accent: string;
  }[] = [
    {
      category: "Smartphone",
      label: "Smartphones & Tablets",
      description: "Screen, battery & charging repairs",
      icon: Smartphone,
      accent: "bg-[#FCD03D]",
    },
    {
      category: "Laptop & PC",
      label: "Laptops & Desktop PCs",
      description: "Motherboard, thermal & OS overhaul",
      icon: Laptop,
      accent: "bg-[#DEDAD0]",
    },
    {
      category: "AC",
      label: "Air Conditioners / HVAC",
      description: "Cooling gas, compressor & cleaning",
      icon: Wind,
      accent: "bg-[#FF5B2E]",
    },
    {
      category: "Refrigerator",
      label: "Refrigerators & Freezers",
      description: "Inverter circuit, gas & thermostat",
      icon: Snowflake,
      accent: "bg-[#FCD03D]",
    },
    {
      category: "TV",
      label: "Smart TVs & Displays",
      description: "Display panel, logic board & backlights",
      icon: Tv,
      accent: "bg-[#DEDAD0]",
    },
    {
      category: "Washing Machine",
      label: "Washing Machines",
      description: "Drum bearing, belt & motor diagnostics",
      icon: Disc,
      accent: "bg-[#FF5B2E]",
    },
    {
      category: "Electrical",
      label: "Electrical & Wiring",
      description: "Short-circuit, earthing & DB breaker",
      icon: Zap,
      accent: "bg-[#FCD03D]",
    },
  ];

  const topRow = categoryConfig.slice(0, 4);
  const bottomRow = categoryConfig.slice(4);

  return (
    <section className="w-full bg-[#F5F0E6] py-16 lg:py-24 border-b-2 border-[#151515]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-block bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-3.5 py-1.5 rounded-[6px] font-mono text-xs font-bold text-[#151515] mb-3">
            [ SYSTEM COVERAGE ]
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-[#151515] tracking-tight">
            Popular Repair Categories
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#151515]/80 mt-2 font-medium max-w-xl">
            Trained specialists available in your neighborhood for immediate diagnostic dispatch.
          </p>
        </div>

        {/* 7 Category Tiles (4 top, 3 centered bottom) */}
        <div className="flex flex-col gap-5">
          {/* Top Row: 4 Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topRow.map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.category] || 0;

              return (
                <Link
                  key={cat.category}
                  href={`/services?category=${encodeURIComponent(cat.category)}`}
                  className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-5 flex flex-col items-start gap-3 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#151515] transition-all group"
                >
                  <div
                    className={`w-12 h-12 ${cat.accent} border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0px_#151515] group-hover:rotate-6 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-[#151515]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#151515] group-hover:text-[#FF5B2E] transition-colors">
                      {cat.label}
                    </h4>
                    <p className="font-sans text-xs text-[#151515]/70 mt-1 line-clamp-1">{cat.description}</p>
                    {/* Real Database Count Badge */}
                    <span className="inline-block mt-2 font-mono text-[11px] font-bold bg-[#F5F0E6] border border-[#151515] px-2 py-0.5 rounded text-[#151515]">
                      {count > 0 ? `${count} Active Service${count > 1 ? "s" : ""}` : "Available on demand"}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#FF5B2E] inline-flex items-center gap-1 mt-auto pt-2">
                    <span>Browse repairs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Row: 3 Centered Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto w-full">
            {bottomRow.map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.category] || 0;

              return (
                <Link
                  key={cat.category}
                  href={`/services?category=${encodeURIComponent(cat.category)}`}
                  className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-5 flex flex-col items-start gap-3 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#151515] transition-all group"
                >
                  <div
                    className={`w-12 h-12 ${cat.accent} border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0px_#151515] group-hover:rotate-6 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-[#151515]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#151515] group-hover:text-[#FF5B2E] transition-colors">
                      {cat.label}
                    </h4>
                    <p className="font-sans text-xs text-[#151515]/70 mt-1 line-clamp-1">{cat.description}</p>
                    {/* Real Database Count Badge */}
                    <span className="inline-block mt-2 font-mono text-[11px] font-bold bg-[#F5F0E6] border border-[#151515] px-2 py-0.5 rounded text-[#151515]">
                      {count > 0 ? `${count} Active Service${count > 1 ? "s" : ""}` : "Available on demand"}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#FF5B2E] inline-flex items-center gap-1 mt-auto pt-2">
                    <span>Browse repairs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}