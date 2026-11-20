import React from "react";

interface PageHeadingProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeading({
  title,
  description,
  badge,
  actions,
  className = "",
}: PageHeadingProps) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-[#151515] ${className}`}
    >
      <div className="flex flex-col gap-1.5">
        {badge && (
          <div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 bg-[#FCD03D] border border-[#151515] text-[11px] font-mono font-bold uppercase tracking-wider text-[#151515]">
            <span className="w-1.5 h-1.5 bg-[#FF5B2E]"></span>
            {badge}
          </div>
        )}
        <h1 className="font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight uppercase">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[#151515]/70 max-w-2xl font-medium">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">{actions}</div>
      )}
    </div>
  );
}