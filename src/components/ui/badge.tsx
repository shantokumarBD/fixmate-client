import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "outline";
  children: React.ReactNode;
}

export function Badge({
  variant = "primary",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    primary:
      "bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-hard-sm",
    secondary:
      "bg-[#FCD03D] text-[#151515] border-2 border-[#151515] shadow-hard-sm",
    success: "bg-[#DCFCE7] text-[#166534] border-2 border-[#166534]",
    warning: "bg-[#FEF3C7] text-[#92400E] border-2 border-[#92400E]",
    danger: "bg-[#FEE2E2] text-[#991B1B] border-2 border-[#991B1B]",
    info: "bg-[#DBEAFE] text-[#1E40AF] border-2 border-[#1E40AF]",
    neutral: "bg-[#F3F4F6] text-[#374151] border-2 border-[#151515]",
    outline:
      "bg-white text-[#151515] border-2 border-[#151515] shadow-hard-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wider select-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}