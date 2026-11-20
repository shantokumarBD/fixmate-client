import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  
  const variants = {
    primary:
      "bg-[#FF5B2E] text-white hover:bg-[#E0481D] border-2 border-[#151515] shadow-hard",
    secondary:
      "bg-[#FCD03D] text-[#151515] hover:bg-[#E6BA2B] border-2 border-[#151515] shadow-hard",
    outline:
      "bg-white text-[#151515] hover:bg-[#FEF9EF] border-2 border-[#151515] shadow-hard",
    destructive:
      "bg-[#DC2626] text-white hover:bg-[#B91C1C] border-2 border-[#151515] shadow-hard",
    ghost: "bg-transparent text-[#151515] hover:bg-[#151515]/10",
  };

  
  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-13 px-8 text-base",
    icon: "h-11 w-11 p-0",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:pointer-events-none select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}