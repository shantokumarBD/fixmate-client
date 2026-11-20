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
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-xs font-black uppercase tracking-wider select-none ${
        isPaid
          ? "bg-[#10B981] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]"
          : "bg-[#F5F0E6] text-[#FF5B2E] border-2 border-[#FF5B2E]"
      } ${className}`}
    >
      {showIcon &&
        (isPaid ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5" />
        ))}
      <span>{isPaid ? "PAID" : "UNPAID"}</span>
    </span>
  );
}