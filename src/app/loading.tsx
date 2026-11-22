import React from "react";
import { Wrench } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#FEF9EF] flex flex-col justify-center items-center p-4 select-none">
      <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[5px_5px_0px_#151515] p-6 max-w-xs w-full text-center space-y-4">
        {/* Animated Brand Tool Icon */}
        <div className="w-12 h-12 mx-auto bg-[#FF5B2E] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#000000] animate-bounce">
          <Wrench className="w-6 h-6 text-white" />
        </div>

        <div>
          <span className="font-heading font-extrabold text-base text-[#151515] block tracking-tight">
            FixMate Workbench
          </span>
          <span className="font-mono text-xs text-[#5B403A] block mt-0.5">
            CALIBRATING STATIONS...
          </span>
        </div>

        {/* Neobrutalist Flat Loading Bar */}
        <div className="w-full h-3 bg-[#FEF9EF] border-2 border-[#151515] rounded-[4px] overflow-hidden p-0.5">
          <div className="h-full bg-[#FF5B2E] rounded-[2px] animate-pulse w-2/3"></div>
        </div>
      </div>
    </div>
  );
}