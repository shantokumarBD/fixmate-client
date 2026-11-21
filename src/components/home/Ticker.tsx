import React from "react";
import { SERVICE_CATEGORIES } from "@/constants/roles";

export function Ticker() {
  return (
    <section
      aria-label="Repair Service Features Ticker"
      className="w-full bg-white border-b-2 border-[#151515] py-3 overflow-hidden select-none"
    >
      <style>{`
        @keyframes tickerMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker-marquee {
          display: flex;
          width: max-content;
          animation: tickerMarquee 25s linear infinite;
        }
        .animate-ticker-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Moving Track */}
      <div className="animate-ticker-marquee font-mono text-xs font-bold text-[#151515]">
        {/* Set 1 */}
        <div className="flex items-center gap-6 shrink-0 pr-6">
          {SERVICE_CATEGORIES.map((category) => (
            <React.Fragment key={category}>
              <span className="uppercase tracking-wider">🛠️ {category}</span>
              <span className="text-[#FF5B2E]">◆</span>
            </React.Fragment>
          ))}
          <span className="bg-[#FCD03D] px-2 py-0.5 border-2 border-[#151515] rounded-[4px] shadow-[1px_1px_0px_#151515]">
            100% VERIFIED MASTERS
          </span>
          <span className="text-[#FF5B2E]">◆</span>
          <span className="bg-[#FF5B2E] text-[#151515] px-2 py-0.5 border-2 border-[#151515] rounded-[4px] shadow-[1px_1px_0px_#151515]">
            90-DAY WORKSHOP WARRANTY
          </span>
          <span className="text-[#FF5B2E]">◆</span>
          <span>ZERO PREPAYMENT ESCROW</span>
          <span className="text-[#FF5B2E]">◆</span>
          <span className="bg-[#151515] text-[#FEF9EF] px-2 py-0.5 border-2 border-[#151515] rounded-[4px]">
            REAL-TIME DIAGNOSTIC LOGS
          </span>
          <span className="text-[#FF5B2E]">◆</span>
        </div>

        {/* Set 2 (Continuous Loop Seamless Match) */}
        <div className="flex items-center gap-6 shrink-0 pr-6" aria-hidden="true">
          {SERVICE_CATEGORIES.map((category) => (
            <React.Fragment key={`dup-${category}`}>
              <span className="uppercase tracking-wider">🛠️ {category}</span>
              <span className="text-[#FF5B2E]">◆</span>
            </React.Fragment>
          ))}
          <span className="bg-[#FCD03D] px-2 py-0.5 border-2 border-[#151515] rounded-[4px] shadow-[1px_1px_0px_#151515]">
            100% VERIFIED MASTERS
          </span>
          <span className="text-[#FF5B2E]">◆</span>
          <span className="bg-[#FF5B2E] text-[#151515] px-2 py-0.5 border-2 border-[#151515] rounded-[4px] shadow-[1px_1px_0px_#151515]">
            90-DAY WORKSHOP WARRANTY
          </span>
          <span className="text-[#FF5B2E]">◆</span>
          <span>ZERO PREPAYMENT ESCROW</span>
          <span className="text-[#FF5B2E]">◆</span>
          <span className="bg-[#151515] text-[#FEF9EF] px-2 py-0.5 border-2 border-[#151515] rounded-[4px]">
            REAL-TIME DIAGNOSTIC LOGS
          </span>
          <span className="text-[#FF5B2E]">◆</span>
        </div>
      </div>
    </section>
  );
}