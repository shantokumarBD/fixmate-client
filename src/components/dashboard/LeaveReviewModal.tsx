"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Booking } from "@/types/booking";
import { submitReviewAction } from "@/actions/review";
import toast from "react-hot-toast";
import { Star, X, Sparkles, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

interface LeaveReviewModalProps {
  booking: Booking | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 Star — Poor Diagnostic & Service",
  2: "2 Stars — Fair / Below Expectations",
  3: "3 Stars — Satisfactory Repair",
  4: "4 Stars — Very Good Quality & Speed",
  5: "5 Stars — Outstanding Master Craftsmanship!",
};

export function LeaveReviewModal({
  booking,
  onClose,
  onSuccess,
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    if (booking) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [booking, isPending, onClose]);

  if (!booking) return null;

  const activeDisplayRating = hoverRating !== null ? hoverRating : rating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    if (comment.trim().length < 5) {
      toast.error("Please write at least 5 characters describing your service experience");
      return;
    }

    startTransition(async () => {
      const res = await submitReviewAction({
        bookingId: booking._id,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        toast.success(res.message || "Review submitted successfully!");
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.error || "Failed to submit review");
      }
    });
  };

  const ticketCode = `#FX-${booking._id?.slice(-4).toUpperCase()}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#151515]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={() => {
        if (!isPending) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-white border-2 border-[#151515] rounded-[10px] shadow-[6px_6px_0px_#151515] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FCD03D] border-b-2 border-[#151515] p-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0px_#151515] shrink-0">
              <Star className="w-5 h-5 fill-[#FCD03D] text-[#151515]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#FF5B2E] bg-white border border-[#151515] px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#151515]">
                  {ticketCode}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#151515] uppercase tracking-wider">
                  VERIFIED REVIEW
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#151515] mt-0.5 leading-snug">
                {booking.serviceTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] hover:bg-[#FF5B2E] hover:text-white transition-all cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Technician Verified Banner */}
          <div className="bg-[#FEF9EF] border-2 border-[#151515] rounded-[8px] p-3 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#5B403A] block text-[10px] uppercase font-bold">
                Specialist:
              </span>
              <span className="font-bold text-[#151515] text-sm">
                {booking.technicianName || "Certified Master"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#10B981] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Job Completed &amp; Settled</span>
            </div>
          </div>

          {/* Interactive Star Rating Selector */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-[#151515] mb-2">
              Overall Workshop Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= activeDisplayRating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1.5 bg-[#FEF9EF] border-2 border-[#151515] rounded-[8px] shadow-[2px_2px_0px_#151515] hover:bg-[#FCD03D] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
                    aria-label={`Rate ${star} Stars`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        isFilled
                          ? "fill-[#FCD03D] text-[#151515]"
                          : "text-[#151515]/30 fill-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-2 font-mono text-xs font-bold text-[#FF5B2E]">
              {RATING_LABELS[activeDisplayRating] || ""}
            </p>
          </div>

          {/* Comment Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs font-bold uppercase text-[#151515]">
                Your Diagnostic &amp; Service Feedback *
              </label>
              <span className="font-mono text-[10px] text-[#5B403A]">
                {comment.length} characters (min 5)
              </span>
            </div>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the repair quality, technician punctuality, and overall workmanship? Share your honest experience to help other clients."
              className="w-full p-3 bg-[#FEF9EF] border-2 border-[#151515] rounded-[8px] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all resize-none shadow-[2px_2px_0px_#151515]"
            />
          </div>

          {/* Verified Badge Guarantee */}
          <div className="flex items-center gap-2 p-2.5 bg-[#F2EDE3] border border-[#151515]/30 rounded-[6px] font-mono text-[11px] text-[#5B403A]">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              Your review will appear publicly on the service catalog with a <strong>Verified Customer</strong> badge.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="px-4 py-2 bg-white text-[#151515] hover:bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || comment.trim().length < 5}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#FF5B2E] hover:bg-[#B22B00] text-white font-heading font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[3px_3px_0px_#000000] rounded-[6px] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
