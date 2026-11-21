import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    // Primary: FixMate Safety Orange with Bold Neobrutalist Black Text
    primary:
      "bg-[#FF5B2E] text-[#151515] hover:bg-[#E0481D] border-2 border-[#151515] shadow-[3px_3px_0px_#151515]",
    // Secondary: FixMate Benchmark Yellow with Black Text
    secondary:
      "bg-[#FCD03D] text-[#151515] hover:bg-[#E6BA2B] border-2 border-[#151515] shadow-[3px_3px_0px_#151515]",
    // Outline: Clean White with Black border & Text
    outline:
      "bg-white text-[#151515] hover:bg-[#FEF9EF] border-2 border-[#151515] shadow-[2px_2px_0px_#151515]",
    // Destructive: Bold Danger Red with White Text
    destructive:
      "bg-[#DC2626] text-white hover:bg-[#B91C1C] border-2 border-[#151515] shadow-[3px_3px_0px_#151515]",
    // Ghost: Transparent with hover
    ghost: "bg-transparent text-[#151515] hover:bg-[#151515]/10 border-2 border-transparent",
  };

  const sizes = {
    sm: "h-8 px-2.5 text-xs rounded-[4px]",
    md: "h-10 px-4 text-sm rounded-[6px]",
    lg: "h-12 px-6 text-base rounded-[8px]",
    icon: "h-10 w-10 p-0 rounded-[6px]",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 font-heading font-bold uppercase tracking-wider transition-all cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#151515]" />
          <span>{loadingText || "Please wait..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}