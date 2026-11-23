"use client";

import React, { useEffect } from "react";
import { Booking } from "@/types/booking";
import { JobTimelineTracker } from "@/components/dashboard/JobTimelineTracker";
import { X, Wrench, ShieldCheck } from "lucide-react";

interface JobTimelineModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export function JobTimelineModal({ booking, onClose }: JobTimelineModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (booking) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [booking, onClose]);

  if (!booking) return null;

  const ticketCode = `#FX-${booking._id?.slice(-6).toUpperCase()}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#151515]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border-2 border-[#151515] rounded-[10px] shadow-[6px_6px_0px_#151515] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FCD03D] border-b-2 border-[#151515] p-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0px_#151515] shrink-0">
              <Wrench className="w-5 h-5 text-[#151515]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#FF5B2E] bg-white border border-[#151515] px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#151515]">
                  {ticketCode}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#151515] uppercase tracking-wider">
                  JOB TIMELINE TRACKER
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#151515] mt-0.5">
                {booking.serviceTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] hover:bg-[#FF5B2E] hover:text-white transition-all cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          <JobTimelineTracker booking={booking} />
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FEF9EF] border-t-2 border-[#151515] p-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#5B403A] font-mono text-xs">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>90-Day FixMate Warranty Protected</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white text-[#151515] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase hover:bg-[#FCD03D] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
