import React from "react";
import { Wrench } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "There are no records matching your request or filter.",
  badge = "WORKBENCH EMPTY",
  icon,
  actionText,
  onAction,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`w-full bg-white border-2 border-[#151515] shadow-hard rounded-[10px] p-8 sm:p-12 text-center flex flex-col items-center justify-center ${className}`}
    >
      {/* Icon Frame */}
      <div className="w-20 h-20 bg-[#FEF9EF] border-2 border-[#151515] shadow-hard-sm flex items-center justify-center mb-5 relative">
        <span className="absolute -top-2.5 -right-2.5 bg-[#FCD03D] font-mono text-[9px] font-black border border-[#151515] px-1.5 py-0.5 uppercase">
          IDLE
        </span>
        {icon || <Wrench className="w-10 h-10 text-[#FF5B2E]" />}
      </div>

      {/* Docket Tag */}
      <div className="inline-block bg-[#FEF9EF] border border-[#151515] px-2.5 py-1 mb-2 font-mono text-xs font-bold text-[#FF5B2E] uppercase">
        {badge}
      </div>

      {/* Title & Description */}
      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#151515] mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#151515]/70 max-w-sm font-medium mb-6">
        {description}
      </p>

      {/* Action CTA Button */}
      {actionText && (
        <div>
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5B2E] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              {actionText}
            </a>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5B2E] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}