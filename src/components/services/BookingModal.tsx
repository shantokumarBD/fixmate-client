"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X, Calendar, Clock, MapPin, Phone, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { ServiceDetail } from "@/types/service";
import { createBookingAction } from "@/actions/booking";
import { ROUTES } from "@/constants/routes";

interface BookingModalProps {
  service: ServiceDetail;
  isOpen: boolean;
  onClose: () => void;
  customerPhone?: string;
  customerAddress?: string;
}

export function BookingModal({
  service,
  isOpen,
  onClose,
}: BookingModalProps) {
  const router = useRouter();
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Minimum date is today (timezone safe)
  const todayString = new Date().toISOString().split("T")[0];
  const isDescValid = charCount >= 20;

  // Native FormData Handler (Like HireLoop)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const preferredDate = formData.get("preferredDate")?.toString().trim() || "";
    const timeSlot = formData.get("timeSlot")?.toString().trim() || "Morning (9 AM - 12 PM)";
    const phone = formData.get("customerPhone")?.toString().trim() || "";
    const address = formData.get("address")?.toString().trim() || "";
    const problemDescription = formData.get("problemDescription")?.toString().trim() || "";

    // 1. Minimum 20 characters rule
    if (problemDescription.length < 20) {
      const msg = "Problem description must be at least 20 characters long.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    // 2. Validate required fields
    if (!preferredDate) {
      const msg = "Preferred date is required.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!phone) {
      const msg = "Valid contact phone number is required.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!address) {
      const msg = "Service location/address is required.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const result = await createBookingAction({
        serviceId: service._id,
        preferredDate,
        timeSlot,
        customerPhone: phone,
        address,
        problemDescription,
      });

      if (!result.success) {
        const errorMsg = result.error || "Failed to submit request.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      toast.success(result.message || "Repair request submitted successfully!");
      onClose();
      router.push(ROUTES.CUSTOMER.BOOKINGS);
    } catch {
      const errorMsg = "Unexpected error occurred. Please try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pt-22 sm:pt-24 pb-6 px-4 flex items-start justify-center overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#151515]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog (Strictly within 100vh, top gap from navbar, zero scrollbar) */}
      <div className="relative w-full max-w-lg bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Compact Fixed Top Header */}
        <div className="bg-[#FCD03D] border-b-2 border-[#151515] px-4 py-2.5 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#151515]" />
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#151515]">
              Request Repair Service
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 bg-white border-2 border-[#151515] rounded-[6px] shadow-[1px_1px_0px_#151515] hover:bg-[#FEF9EF] cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-[#151515]" />
          </button>
        </div>

        {/* 2. Compact Form Content (Fits naturally in 100vh with no scrollbar) */}
        <form
          id="booking-form"
          onSubmit={handleSubmit}
          className="p-4 space-y-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Service Snapshot Card */}
          <div className="p-2.5 bg-[#FEF9EF] border-2 border-[#151515] rounded-[8px] flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="font-mono text-[9px] font-bold bg-[#151515] text-white px-2 py-0.5 rounded-[3px] uppercase">
                {service.category}
              </span>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#151515] mt-0.5 truncate">
                {service.title}
              </h4>
              <p className="font-mono text-[10px] text-[#151515]/70">
                Technician: {service.technician?.name || service.technicianName}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-[9px] block text-[#151515]/70 font-bold uppercase">
                Flat Estimate
              </span>
              <span className="font-mono text-base sm:text-lg font-black text-[#151515]">
                ${service.basePrice}
              </span>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-2 bg-[#FFDAD6] border-2 border-[#BA1A1A] rounded-[6px] flex items-start gap-2 text-xs font-mono font-medium text-[#BA1A1A]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Field: Preferred Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#151515] uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#151515]" />
                <span>Preferred Date *</span>
              </label>
              <input
                name="preferredDate"
                type="date"
                min={todayString}
                required
                className="w-full bg-[#F5F0E6] border-2 border-[#151515] rounded-[6px] px-2.5 py-1.5 text-xs font-mono font-bold text-[#151515] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold text-[#151515] uppercase mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#151515]" />
                <span>Time Slot</span>
              </label>
              <select
                name="timeSlot"
                defaultValue="Morning (9 AM - 12 PM)"
                className="w-full bg-[#F5F0E6] border-2 border-[#151515] rounded-[6px] px-2 py-1.5 text-xs font-mono font-bold text-[#151515] focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
              </select>
            </div>
          </div>

          {/* Field: Contact Phone */}
          <div>
            <label className="block font-mono text-[10px] font-bold text-[#151515] uppercase mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#151515]" />
              <span>Contact Phone Number *</span>
            </label>
            <input
              name="customerPhone"
              type="tel"
              required
              placeholder="e.g. +880 1712-345678"
              className="w-full bg-[#F5F0E6] border-2 border-[#151515] rounded-[6px] px-2.5 py-1.5 text-xs font-mono font-medium text-[#151515] placeholder-[#151515]/50 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Field: Address */}
          <div>
            <label className="block font-mono text-[10px] font-bold text-[#151515] uppercase mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#151515]" />
              <span>Service Location / Address *</span>
            </label>
            <input
              name="address"
              type="text"
              required
              placeholder="House, Road, Area (e.g. House 12, Road 4, Dhanmondi)"
              className="w-full bg-[#F5F0E6] border-2 border-[#151515] rounded-[6px] px-2.5 py-1.5 text-xs font-mono font-medium text-[#151515] placeholder-[#151515]/50 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Field: Problem Description (Min 20 characters rule with live counter) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-[10px] font-bold text-[#151515] uppercase">
                Problem Description *
              </label>
              <span
                className={`font-mono text-[10px] font-bold ${
                  isDescValid ? "text-emerald-700" : "text-[#BA1A1A]"
                }`}
              >
                {charCount}/20 min chars
              </span>
            </div>
            <textarea
              name="problemDescription"
              required
              rows={3}
              onChange={(e) => setCharCount(e.target.value.trim().length)}
              placeholder="Describe the issue, device model, or symptoms (minimum 20 characters)..."
              className="w-full bg-[#F5F0E6] border-2 border-[#151515] rounded-[6px] p-2 text-xs font-mono font-medium text-[#151515] placeholder-[#151515]/50 focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Trust Assurance Strip */}
          <div className="py-2 px-2.5 bg-[#F5F0E6] border border-[#151515]/40 rounded-[6px] flex items-center gap-2 font-mono text-[10px] text-[#151515]/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5B2E] shrink-0" />
            <span>Pay $0 today. Inspection first, settlement only after completion.</span>
          </div>
        </form>

        {/* 3. Compact Fixed Bottom Action Buttons with Comfortable Bottom Padding */}
        <div className="bg-white border-t-2 border-[#151515] px-4 pt-3 pb-4 shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="py-2 px-4 bg-white border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold text-[#151515] hover:bg-[#FEF9EF] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="booking-form"
            disabled={loading || !isDescValid}
            className={`py-2 px-5 bg-[#FF5B2E] text-[#151515] border-2 border-[#151515] rounded-[6px] font-heading font-extrabold text-xs uppercase tracking-wide shadow-[2px_2px_0px_#151515] hover:shadow-[1px_1px_0px_#151515] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${
              loading || !isDescValid ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Submitting Request..." : "Confirm & Request Repair"}
          </button>
        </div>
      </div>
    </div>
  );
}