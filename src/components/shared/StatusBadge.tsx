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
    { label: string; classes: string; icon: React.ReactNode }
  > = {
    requested: {
      label: "REQUESTED",
      classes: "bg-[#2563EB] text-white border-2 border-[#151515]",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    accepted: {
      label: "ACCEPTED",
      classes: "bg-[#4F46E5] text-white border-2 border-[#151515]",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    "in-progress": {
      label: "IN PROGRESS",
      classes: "bg-[#F59E0B] text-[#151515] border-2 border-[#151515]",
      icon: <Wrench className="w-3.5 h-3.5" />,
    },
    completed: {
      label: "COMPLETED",
      classes: "bg-[#10B981] text-white border-2 border-[#151515]",
      icon: <CheckCheck className="w-3.5 h-3.5" />,
    },
    cancelled: {
      label: "CANCELLED",
      classes: "bg-[#6B7280] text-white border-2 border-[#151515]",
      icon: <Ban className="w-3.5 h-3.5" />,
    },
    rejected: {
      label: "REJECTED",
      classes: "bg-[#EF4444] text-white border-2 border-[#151515]",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[normalized] || {
    label: status.toUpperCase(),
    classes: "bg-gray-200 text-gray-800 border-2 border-[#151515]",
    icon: <Clock className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-black uppercase tracking-wider select-none shadow-[2px_2px_0px_#151515] ${current.classes} ${className}`}
    >
      {showIcon && current.icon}
      <span>{current.label}</span>
    </span>
  );
}