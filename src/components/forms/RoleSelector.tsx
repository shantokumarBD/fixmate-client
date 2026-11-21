"use client";

import { User, Wrench } from "lucide-react";

interface RoleSelectorProps {
  value: "customer" | "technician";
  onChange: (role: "customer" | "technician") => void;
  disabled?: boolean;
}

export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] font-medium tracking-wide text-[#7A5B53] uppercase">
        ACCOUNT TYPE // SELECT ROLE
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
        {/* Customer Card */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("customer")}
          className={`border-2 border-[#151515] p-3 rounded-[8px] text-left transition-all cursor-pointer ${
            value === "customer"
              ? "bg-[#FCD03D] shadow-[3px_3px_0px_#151515] -translate-x-0.5 -translate-y-0.5"
              : "bg-white hover:bg-[#F8F3E9]"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-6 h-6 bg-white border-2 border-[#151515] rounded-[4px] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[#151515]" />
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-[#151515] bg-white flex items-center justify-center">
              {value === "customer" && (
                <span className="w-2 h-2 rounded-full bg-[#151515]" />
              )}
            </div>
          </div>
          <div className="font-heading font-bold text-sm text-[#151515] leading-none mb-1">
            Customer
          </div>
          <div className="font-mono text-[10px] text-[#5B403A]">
            Book repairs & track escrow
          </div>
        </button>

        {/* Technician Card */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("technician")}
          className={`border-2 border-[#151515] p-3 rounded-[8px] text-left transition-all cursor-pointer ${
            value === "technician"
              ? "bg-[#FCD03D] shadow-[3px_3px_0px_#151515] -translate-x-0.5 -translate-y-0.5"
              : "bg-white hover:bg-[#F8F3E9]"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-6 h-6 bg-white border-2 border-[#151515] rounded-[4px] flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5 text-[#151515]" />
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-[#151515] bg-white flex items-center justify-center">
              {value === "technician" && (
                <span className="w-2 h-2 rounded-full bg-[#151515]" />
              )}
            </div>
          </div>
          <div className="font-heading font-bold text-sm text-[#151515] leading-none mb-1">
            Technician
          </div>
          <div className="font-mono text-[10px] text-[#5B403A]">
            Accept jobs & dispatch repairs
          </div>
        </button>
      </div>
    </div>
  );
}