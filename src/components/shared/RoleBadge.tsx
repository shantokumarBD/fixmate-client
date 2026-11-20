import React from "react";
import { UserRole } from "@/constants/roles";
import { User, Wrench, ShieldAlert } from "lucide-react";

interface RoleBadgeProps {
  role: UserRole | string;
  className?: string;
}

export function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  const normalized = role.toLowerCase();

  const configs: Record<
    string,
    { label: string; classes: string; icon: React.ReactNode }
  > = {
    customer: {
      label: "Customer",
      classes: "bg-[#DBEAFE] text-[#1E40AF] border-2 border-[#151515]",
      icon: <User className="w-3.5 h-3.5" />,
    },
    technician: {
      label: "Technician",
      classes: "bg-[#FEF3C7] text-[#92400E] border-2 border-[#151515]",
      icon: <Wrench className="w-3.5 h-3.5" />,
    },
    admin: {
      label: "Admin",
      classes: "bg-[#F3E8FF] text-[#6B21A8] border-2 border-[#151515]",
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[normalized] || {
    label: role,
    classes: "bg-gray-100 text-gray-800 border-2 border-[#151515]",
    icon: <User className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-xs font-bold border-2 border-[#151515] select-none shadow-[2px_2px_0px_#151515] ${current.classes} ${className}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}