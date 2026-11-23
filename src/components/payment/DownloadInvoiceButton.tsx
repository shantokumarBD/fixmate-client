"use client";

import React, { useState } from "react";
import { FileText, CheckCircle2, Download } from "lucide-react";
import { generateInvoicePDF, InvoiceData } from "@/lib/pdf/generateInvoice";
import toast from "react-hot-toast";

interface DownloadInvoiceButtonProps {
  invoiceData: InvoiceData;
  className?: string;
  variant?: "primary" | "secondary";
}

export function DownloadInvoiceButton({
  invoiceData,
  className = "",
  variant = "primary",
}: DownloadInvoiceButtonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const success = generateInvoicePDF(invoiceData);
    if (success) {
      toast.success("Workshop Invoice downloaded successfully!");
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } else {
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (variant === "secondary") {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FEF9EF] hover:bg-[#FCD03D] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer ${className}`}
        title="Download Official FixMate PDF Invoice"
      >
        {downloaded ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <FileText className="w-3.5 h-3.5 text-[#FF5B2E]" />
            <span>PDF Invoice</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FCD03D] hover:bg-[#FFE072] text-[#151515] font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider border-2 border-[#151515] shadow-[4px_4px_0px_#151515] hover:shadow-[2px_2px_0px_#151515] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-[8px] cursor-pointer ${className}`}
    >
      {downloaded ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          <span>Invoice Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-[#151515]" />
          <span>Download PDF Invoice</span>
        </>
      )}
    </button>
  );
}
