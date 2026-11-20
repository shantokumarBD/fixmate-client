import Link from "next/link";
import { Home, Wrench } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FEF9EF] flex flex-col justify-between text-[#151515] p-4 sm:p-6 md:p-10 font-sans selection:bg-[#FF5B2E] selection:text-white">
      {/* Top Technical Dispatch Bar */}
      <div className="w-full max-w-3xl mx-auto mb-6">
        <div className="bg-[#FFFFFF] border-2 border-[#151515] shadow-[4px_4px_0px_#151515] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF5B2E] border border-[#151515] inline-block"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
              System Dispatch // ERR-404-DISPATCH
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold bg-[#FEF9EF] border border-[#151515] px-2 py-0.5 shadow-[1px_1px_0px_#151515]">
            WORKBENCH CHECK
          </span>
        </div>
      </div>

      {/* Main 404 Workshop Manifest Card */}
      <main className="w-full max-w-2xl mx-auto my-auto bg-[#FFFFFF] border-2 border-[#151515] shadow-[6px_6px_0px_#151515] overflow-hidden">
        {/* Ticket Header Docket Strip */}
        <div className="bg-[#FCD03D] px-6 py-3 border-b-2 border-[#151515] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#151515] inline-block"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
              Maintenance Manifest // Station 04
            </span>
          </div>
          <span className="font-mono text-xs bg-[#FFFFFF] text-[#151515] px-2 py-0.5 border-2 border-[#151515] uppercase font-bold">
            Code: MISPLACED_TOOL
          </span>
        </div>

        {/* Ticket Body Content */}
        <div className="p-6 sm:p-10 flex flex-col items-center text-center">
          {/* 404 Headline with Offset Badge */}
          <div className="relative mb-6 select-none">
            <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight text-[#FFFFFF] uppercase"
                style={{ WebkitTextStroke: "3px #151515", textShadow: "4px 4px 0px #151515" }}>
              404
            </h1>
            <div className="absolute -top-2 -right-4 sm:-right-6 bg-[#FF5B2E] text-[#151515] font-mono text-xs uppercase font-bold px-2 py-1 border-2 border-[#151515] rotate-6 shadow-[2px_2px_0px_#151515]">
              Item Missing
            </div>
          </div>

          {/* Workshop Vector Illustration (Crossed Tools) */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 mb-6 p-3 bg-[#F8F3E9] border-2 border-[#151515] shadow-[4px_4px_0px_#151515] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="80" r="64" fill="#F2EDE3" stroke="#151515" strokeWidth="2" strokeDasharray="6 6" />
              {/* Screwdriver */}
              <g transform="rotate(-45 80 80)">
                <rect x="73" y="16" width="14" height="42" rx="3" fill="#FCD03D" stroke="#151515" strokeWidth="2" />
                <rect x="77" y="22" width="6" height="12" fill="#151515" />
                <rect x="77" y="38" width="6" height="14" fill="#151515" />
                <rect x="71" y="58" width="18" height="6" fill="#374151" stroke="#151515" strokeWidth="2" />
                <rect x="76" y="64" width="8" height="62" fill="#5D5F5F" stroke="#151515" strokeWidth="2" />
                <polygon points="76,126 84,126 82,142 78,142" fill="#374151" stroke="#151515" strokeWidth="2" />
              </g>
              {/* Wrench */}
              <g transform="rotate(45 80 80)">
                <rect x="74" y="38" width="12" height="84" fill="#FF5B2E" stroke="#151515" strokeWidth="2" />
                <rect x="77" y="54" width="6" height="52" fill="#151515" />
                <path d="M68 38 C68 25, 92 25, 92 38 L96 38 C96 20, 64 20, 64 38 Z" fill="#374151" stroke="#151515" strokeWidth="2" />
                <circle cx="80" cy="30" r="7" fill="#F2EDE3" stroke="#151515" strokeWidth="2" />
                <path d="M64 122 C64 140, 96 140, 96 122 L88 122 C88 131, 72 131, 72 122 Z" fill="#374151" stroke="#151515" strokeWidth="2" />
              </g>
              <circle cx="80" cy="80" r="9" fill="#FEF9EF" stroke="#151515" strokeWidth="2" />
              <circle cx="80" cy="80" r="3" fill="#151515" />
            </svg>
          </div>

          {/* Heading & Message */}
          <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#151515] mb-2">
            PAGE OUT OF ORDER // 404 NOT FOUND
          </h2>
          <p className="text-xs sm:text-sm text-[#5B403A] max-w-md mb-6 leading-relaxed font-medium">
            Looks like this tool is missing from our workbench. The page you are looking for has been moved, repaired, or never existed in the workshop.
          </p>

          <div className="w-full border-t-2 border-dashed border-[#151515] my-2 mb-6"></div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={ROUTES.HOME}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5B2E] text-[#151515] font-bold text-sm uppercase border-2 border-[#151515] shadow-[4px_4px_0px_#151515] hover:shadow-[6px_6px_0px_#151515] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href={ROUTES.SERVICES}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FFFFFF] text-[#151515] font-bold text-sm uppercase border-2 border-[#151515] shadow-[4px_4px_0px_#151515] hover:shadow-[6px_6px_0px_#151515] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <Wrench className="w-4 h-4" />
              Browse Services
            </Link>
          </div>
        </div>

        {/* Ticket Footer Bar */}
        <div className="bg-[#F8F3E9] px-6 py-2.5 border-t-2 border-[#151515] flex items-center justify-between text-xs font-mono text-[#5B403A]">
          <span>Bay: RACK-NULL-00</span>
          <span>Status: BENCH_CLEAR</span>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-3xl mx-auto mt-6 text-center font-mono text-xs text-[#5B403A]">
        FixMate Workshop Dispatch Systems // 404 Safety Catch
      </footer>
    </div>
  );
}