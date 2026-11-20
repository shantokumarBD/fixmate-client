"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  badge?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  badge = "CONFIRM ACTION",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
 
  if (!isOpen) return null;

  const confirmColors = {
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
    warning: "bg-[#FCD03D] text-[#151515] hover:bg-[#E6BA2B]",
    primary: "bg-[#FF5B2E] text-white hover:bg-[#E0481D]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
      {/* Modal Dialog Card */}
      <div className="w-full max-w-lg bg-[#FEF9EF] border-2 border-[#151515] shadow-[8px_8px_0px_#151515] relative overflow-hidden">
        {/* Technical Header Strip */}
        <div className="border-b-2 border-[#151515] bg-[#F2EDE3] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 border border-[#151515] ${
                variant === "danger"
                  ? "bg-[#DC2626]"
                  : variant === "warning"
                  ? "bg-[#FCD03D]"
                  : "bg-[#FF5B2E]"
              }`}
            ></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
              {badge}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-6 h-6 border-2 border-[#151515] bg-white flex items-center justify-center hover:bg-[#151515] hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-[#151515] mb-2">
            {title}
          </h3>

          <div className="flex items-start gap-2.5 bg-[#FEE2E2] border-2 border-[#DC2626] p-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-semibold text-[#991B1B] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#151515]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white text-[#151515] font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer disabled:opacity-50 ${confirmColors[variant]}`}
            >
              {isLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}