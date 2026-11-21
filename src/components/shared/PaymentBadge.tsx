// File: src/components/shared/PaymentBadge.tsx
import React from "react";
import { PaymentStatus } from "@/constants/roles";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface PaymentBadgeProps {
  status: PaymentStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function PaymentBadge({
  status,
  className = "",
  showIcon = true,
}: PaymentBadgeProps) {
  const isPaid = status.toLowerCase() === "paid";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-mono font-bold tracking-wide border select-none cursor-default ${
        isPaid
          ? "bg-[#ECFDF5] text-[#065F46] border-[#6EE7B7]"
          : "bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]"
      } ${className}`}
    >
      {showIcon &&
        (isPaid ? (
          <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
        ) : (
          <AlertCircle className="w-3 h-3 text-[#E11D48]" />
        ))}
      <span>{isPaid ? "Paid" : "Unpaid"}</span>
    </span>
  );
}