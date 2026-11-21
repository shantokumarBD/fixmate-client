// File: src/components/shared/StatusBadge.tsx
import React from "react";
import { BookingStatus } from "@/constants/roles";
import {
  Clock,
  CheckCircle2,
  Wrench,
  CheckCheck,
  Ban,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: BookingStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  className = "",
  showIcon = true,
}: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const configs: Record<
    string,
    { label: string; classes: string; dot: string; icon: React.ReactNode }
  > = {
    requested: {
      label: "Requested",
      classes: "bg-[#EFF6FF] text-[#1D4ED8] border-[#93C5FD]",
      dot: "bg-[#2563EB]",
      icon: <Clock className="w-3 h-3" />,
    },
    accepted: {
      label: "Accepted",
      classes: "bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC]",
      dot: "bg-[#4F46E5]",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    "in-progress": {
      label: "In Progress",
      classes: "bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]",
      dot: "bg-[#F59E0B]",
      icon: <Wrench className="w-3 h-3" />,
    },
    completed: {
      label: "Completed",
      classes: "bg-[#ECFDF5] text-[#065F46] border-[#6EE7B7]",
      dot: "bg-[#10B981]",
      icon: <CheckCheck className="w-3 h-3" />,
    },
    cancelled: {
      label: "Cancelled",
      classes: "bg-[#F3F4F6] text-[#4B5563] border-[#D1D5DB]",
      dot: "bg-[#6B7280]",
      icon: <Ban className="w-3 h-3" />,
    },
    rejected: {
      label: "Rejected",
      classes: "bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]",
      dot: "bg-[#EF4444]",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const current = configs[normalized] || {
    label: status,
    classes: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]",
    dot: "bg-gray-400",
    icon: <Clock className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-mono font-bold tracking-wide border select-none cursor-default ${current.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {showIcon && current.icon}
      <span>{current.label}</span>
    </span>
  );
}