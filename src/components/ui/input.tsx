import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-black uppercase tracking-wider text-[#151515] mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full h-11 px-3.5 py-2 rounded-lg border-2 border-[#151515] bg-white text-sm text-[#151515] font-medium shadow-hard-sm placeholder:text-[#151515]/40 focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] disabled:opacity-50 transition-all ${
          error ? "border-red-600 bg-red-50" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-bold mt-1">{error}</p>}
    </div>
  );
}