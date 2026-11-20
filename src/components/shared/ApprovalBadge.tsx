import React from "react";
import { ApprovalStatus } from "@/constants/roles";
import { ShieldCheck, Clock, ShieldAlert } from "lucide-react";

interface ApprovalBadgeProps {
  status: ApprovalStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function ApprovalBadge({
  status,
  className = "",
  showIcon = true,
}: ApprovalBadgeProps) {
  const normalized = status.toLowerCase();

  const configs: Record<
    string,
    { label: string; classes: string; icon: React.ReactNode }
  > = {
    approved: {
      label: "APPROVED",
      classes: "bg-[#10B981] text-white border-2 border-[#151515]",
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    pending: {
      label: "PENDING APPROVAL",
      classes: "bg-[#FEF3C7] text-[#92400E] border-2 border-[#151515]",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    rejected: {
      label: "REJECTED",
      classes: "bg-[#FEE2E2] text-[#991B1B] border-2 border-[#151515]",
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[normalized] || {
    label: status.toUpperCase(),
    classes: "bg-gray-100 text-gray-700 border-2 border-[#151515]",
    icon: <Clock className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-xs font-black uppercase tracking-wider select-none shadow-[2px_2px_0px_#151515] ${current.classes} ${className}`}
    >
      {showIcon && current.icon}
      <span>{current.label}</span>
    </span>
  );
}