import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  accentColor?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  subtitle,
  accentColor = "text-[#151515]",
  className = "",
}: StatsCardProps) {
  return (
    <div
      className={`bg-white border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515] flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#151515]">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-[4px] bg-[#FEF9EF] border-2 border-[#151515] flex items-center justify-center text-[#151515] shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4">
        <span
          className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${accentColor}`}
        >
          {value}
        </span>
        {subtitle && (
          <p className="text-xs font-semibold text-[#151515]/60 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}