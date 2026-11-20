import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface LogoProps {
  showBadge?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  showBadge = true,
  className = "",
  size = "md",
}: LogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link
      href={ROUTES.HOME}
      className={`flex items-center gap-2.5 select-none group cursor-pointer ${className}`}
    >
      {/* Wrench Square Icon with Hard Shadow */}
      <div
        className={`${iconSizes[size]} bg-[#FF5B2E] border-2 border-[#151515] rounded-[8px] flex items-center justify-center text-white shadow-[2px_2px_0px_#151515] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform`}
      >
        <Wrench className="w-5 h-5 stroke-[2.5]" />
      </div>

      {/* Brand Text + Spec Version Tag */}
      <div className="flex items-center gap-1.5">
        <span
          className={`font-black tracking-tight text-[#151515] uppercase ${textSizes[size]}`}
        >
          FixMate
        </span>
        {showBadge && (
          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-[#FCD03D] border border-[#151515] rounded text-[10px] font-mono font-bold tracking-wider uppercase text-[#151515]">
            v2.4
          </span>
        )}
      </div>
    </Link>
  );
}