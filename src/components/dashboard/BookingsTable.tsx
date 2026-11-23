"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Booking } from "@/types/booking";
import { cancelBookingAction } from "@/actions/booking";
import { createCheckoutSessionAction } from "@/actions/payment";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaymentBadge } from "@/components/shared/PaymentBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { JobTimelineModal } from "@/components/dashboard/JobTimelineModal";
import { LeaveReviewModal } from "@/components/dashboard/LeaveReviewModal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  Search,
  Ban,
  Lock,
  ArrowRight,
  Inbox,
  CreditCard,
  Loader2,
  Clock,
  Star,
  FileText,
} from "lucide-react";
import { generateInvoicePDF } from "@/lib/pdf/generateInvoice";

interface BookingsTableProps {
  bookings: Booking[];
}

type FilterTab = "all" | "requested" | "accepted" | "in-progress" | "completed" | "cancelled";

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [targetBooking, setTargetBooking] = useState<Booking | null>(null);
  const [timelineBooking, setTimelineBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [isPending, startTransition] = useTransition();
  const [payingId, setPayingId] = useState<string | null>(null);

  const tabs = [
    { id: "all" as FilterTab, label: "All", count: bookings.length },
    {
      id: "requested" as FilterTab,
      label: "Requested",
      count: bookings.filter((b) => b.status?.toLowerCase() === "requested").length,
    },
    {
      id: "accepted" as FilterTab,
      label: "Accepted",
      count: bookings.filter((b) => b.status?.toLowerCase() === "accepted").length,
    },
    {
      id: "in-progress" as FilterTab,
      label: "In Progress",
      count: bookings.filter((b) => b.status?.toLowerCase() === "in-progress").length,
    },
    {
      id: "completed" as FilterTab,
      label: "Completed",
      count: bookings.filter((b) => b.status?.toLowerCase() === "completed").length,
    },
    {
      id: "cancelled" as FilterTab,
      label: "Cancelled",
      count: bookings.filter((b) => b.status?.toLowerCase() === "cancelled").length,
    },
  ];

  const filteredBookings = bookings.filter((b) => {
    if (activeTab !== "all" && b.status?.toLowerCase() !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesTitle = b.serviceTitle?.toLowerCase().includes(query);
      const matchesTech = b.technicianName?.toLowerCase().includes(query);
      const matchesTicket = b._id?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesTech && !matchesTicket) {
        return false;
      }
    }
    return true;
  });

  const handleConfirmCancel = () => {
    if (!targetBooking) return;

    startTransition(async () => {
      const res = await cancelBookingAction(targetBooking._id);
      if (res.success) {
        toast.success(res.message || "Booking cancelled successfully");
        setTargetBooking(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to cancel booking");
      }
    });
  };

  // ৪. R19: Server Action Native Redirect (Zero window.location)
  const handlePayNow = (bookingId: string) => {
    startTransition(async () => {
      setPayingId(bookingId);
      const res = await createCheckoutSessionAction(bookingId);

      if (res && !res.success) {
        toast.error(res.error || "Failed to initiate Stripe payment");
        setPayingId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5B403A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service, technician or ticket..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all rounded-[6px]"
          />
        </div>

        <div className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 self-end sm:self-center">
          <span>MATCHING ORDERS:</span>
          <span className="font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
            {filteredBookings.length}
          </span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#151515] rounded-[6px] transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#151515] text-white shadow-[2px_2px_0px_#FF5B2E]"
                  : "bg-white text-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#FEF9EF]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                  isActive ? "bg-[#FF5B2E] text-white" : "bg-[#F2EDE3] text-[#151515]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table & Cards Container */}
      <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center bg-[#FEF9EF]/30">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <Inbox className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              No Repair Bookings Found
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-sm mt-1 mb-4">
              {searchQuery || activeTab !== "all"
                ? "No work orders matched your selected status filter or search parameters."
                : "You have not submitted any repair requests yet. Explore our certified services to get started."}
            </p>
            {searchQuery || activeTab !== "all" ? (
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
                className="font-mono text-xs font-bold text-[#FF5B2E] uppercase hover:underline cursor-pointer"
              >
                Reset Filter Parameters
              </button>
            ) : (
              <Link
                href={ROUTES.SERVICES}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform rounded-[6px]"
              >
                <span>Browse Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop / Laptop Table View (lg: and above) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[880px]">
                <thead>
                  <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase tracking-wider">
                    <th className="py-3 px-4 font-extrabold w-[28%]">Ticket & Service</th>
                    <th className="py-3 px-3.5 font-extrabold w-[18%]">Technician</th>
                    <th className="py-3 px-3.5 font-extrabold w-[16%]">Schedule</th>
                    <th className="py-3 px-3.5 font-extrabold w-[12%] whitespace-nowrap">Quote / Escrow</th>
                    <th className="py-3 px-3 font-extrabold w-[10%] text-center">Status</th>
                    <th className="py-3 px-3 font-extrabold w-[10%] text-center">Payment</th>
                    <th className="py-3 px-4 font-extrabold w-[16%] text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#151515] font-sans text-xs sm:text-sm">
                  {filteredBookings.map((b) => {
                    const ticketCode = `#FX-${b._id?.slice(-4).toUpperCase()}`;
                    const isRequested = b.status?.toLowerCase() === "requested";
                    const isCompletedUnpaid =
                      b.status?.toLowerCase() === "completed" &&
                      b.paymentStatus?.toLowerCase() === "unpaid";
                    const isPaid = b.paymentStatus?.toLowerCase() === "paid";
                    const isProcessingPayment = payingId === b._id;

                    return (
                      <tr key={b._id} className="hover:bg-[#FEF9EF]/50 transition-colors">
                        {/* Service Title & Ticket */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-heading font-bold text-[#151515] leading-tight">
                              {b.serviceTitle}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[11px] text-[#FF5B2E] font-bold">
                                {ticketCode}
                              </span>
                              {b.category && (
                                <span className="font-mono text-[10px] uppercase text-[#5B403A] bg-[#F2EDE3] border border-[#151515] px-1.5 rounded-[3px]">
                                  {b.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Technician */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-[#151515]">
                            <span>{b.technicianName || "Assigned Specialist"}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          </div>
                          <span className="font-mono text-[10px] text-[#5B403A]">
                            {b.technicianEmail}
                          </span>
                        </td>

                        {/* Schedule */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-[#151515]">
                            {formatDate(b.preferredDate)}
                          </div>
                          <div className="font-mono text-[11px] text-[#5B403A]">
                            {b.timeSlot || "Flexible Window"}
                          </div>
                        </td>

                        {/* Quote Amount */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-extrabold text-[#151515]">
                          {formatCurrency(b.finalAmount || b.basePrice || 0)}
                        </td>

                        {/* Status (Informational Pill, Not a button) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={b.status} />
                        </td>

                        {/* Payment Status (Informational Pill, Not a button) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <PaymentBadge status={b.paymentStatus} />
                        </td>

                        {/* Action Column (The ONLY place where interactive buttons live) */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Job Timeline Tracker Action Button */}
                            <button
                              type="button"
                              onClick={() => setTimelineBooking(b)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FEF9EF] hover:bg-[#FCD03D] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                              title="View Live Job Timeline Tracker"
                            >
                              <Clock className="w-3.5 h-3.5 text-[#FF5B2E]" />
                              <span>Timeline</span>
                            </button>

                            {isCompletedUnpaid ? (
                              <button
                                type="button"
                                onClick={() => handlePayNow(b._id)}
                                disabled={isProcessingPayment}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                              >
                                {isProcessingPayment ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Routing...</span>
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Pay Now</span>
                                  </>
                                )}
                              </button>
                            ) : isPaid ? (
                              <div className="flex items-center gap-1.5">
                                {/* 1-Click PDF Invoice Download Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const ok = generateInvoicePDF({
                                      bookingId: b._id,
                                      serviceTitle: b.serviceTitle,
                                      category: b.category,
                                      customerName: b.customerName,
                                      customerEmail: b.customerEmail,
                                      customerPhone: b.customerPhone,
                                      address: b.address,
                                      technicianName: b.technicianName,
                                      technicianEmail: b.technicianEmail,
                                      preferredDate: b.preferredDate,
                                      timeSlot: b.timeSlot,
                                      problemDescription: b.problemDescription,
                                      basePrice: b.basePrice,
                                      finalAmount: b.finalAmount || b.basePrice || 0,
                                      paidAt: b.paidAt,
                                      transactionId: b.transactionId,
                                    });
                                    if (ok) toast.success("Invoice downloaded successfully!");
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-1.5 bg-[#FEF9EF] hover:bg-[#FCD03D] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                                  title="Download Official FixMate PDF Invoice"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#FF5B2E]" />
                                  <span>Invoice</span>
                                </button>

                                {b.isReviewed ? (
                                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2.5 py-1 rounded-[6px]">
                                    <Star className="w-3.5 h-3.5 fill-[#FCD03D] text-[#151515]" />
                                    <span>{b.review?.rating || 5}★</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setReviewBooking(b)}
                                    className="inline-flex items-center gap-1 px-2 py-1.5 bg-[#FCD03D] hover:bg-[#FFE072] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                                    title="Rate & Review Completed Service"
                                  >
                                    <Star className="w-3.5 h-3.5 fill-[#151515] text-[#151515]" />
                                    <span>Review</span>
                                  </button>
                                )}
                              </div>
                            ) : isRequested ? (
                              <button
                                type="button"
                                onClick={() => setTargetBooking(b)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#DC2626] text-[#DC2626] hover:text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#DC2626] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#5B403A] bg-[#F2EDE3] border border-[#151515]/30 px-2 py-1 rounded-[4px] select-none">
                                <Lock className="w-3 h-3 text-[#5B403A]" />
                                <span>In Bay</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card Manifest View (< lg:) */}
            <div className="block lg:hidden divide-y-2 divide-[#151515]">
              {filteredBookings.map((b) => {
                const ticketCode = `#FX-${b._id?.slice(-4).toUpperCase()}`;
                const isRequested = b.status?.toLowerCase() === "requested";
                const isCompletedUnpaid =
                  b.status?.toLowerCase() === "completed" &&
                  b.paymentStatus?.toLowerCase() === "unpaid";
                const isPaid = b.paymentStatus?.toLowerCase() === "paid";
                const isProcessingPayment = payingId === b._id;

                return (
                  <div key={b._id} className="p-4 sm:p-5 space-y-3.5 hover:bg-[#FEF9EF]/30 transition-colors">
                    {/* Top Row: Ticket Code, Category & Status Badges */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#FF5B2E] font-bold bg-[#FEF9EF] border border-[#151515] px-2 py-0.5 rounded shadow-[1px_1px_0px_#151515]">
                          {ticketCode}
                        </span>
                        {b.category && (
                          <span className="font-mono text-[10px] uppercase font-bold text-[#5B403A] bg-[#F2EDE3] border border-[#151515] px-1.5 py-0.5 rounded">
                            {b.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={b.status} />
                        <PaymentBadge status={b.paymentStatus} />
                      </div>
                    </div>

                    {/* Service Title */}
                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#151515] leading-snug">
                      {b.serviceTitle}
                    </h4>

                    {/* 2x2 Details Manifest Grid */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs font-mono bg-[#FEF9EF] p-3 border-2 border-[#151515] rounded-[8px] shadow-[2px_2px_0px_#151515]">
                      <div>
                        <span className="text-[#5B403A] block text-[10px] font-bold uppercase">SCHEDULE</span>
                        <span className="font-bold text-[#151515] block mt-0.5">
                          {formatDate(b.preferredDate)}
                        </span>
                        {b.timeSlot && (
                          <span className="text-[10px] text-[#5B403A] block">
                            {b.timeSlot}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[#5B403A] block text-[10px] font-bold uppercase">QUOTE / ESCROW</span>
                        <span className="font-extrabold text-[#151515] text-sm block mt-0.5">
                          {formatCurrency(b.finalAmount || b.basePrice || 0)}
                        </span>
                      </div>

                      <div className="col-span-2 pt-1.5 border-t border-[#151515]/15 flex items-center justify-between flex-wrap gap-1">
                        <div>
                          <span className="text-[#5B403A] block text-[10px] font-bold uppercase">TECHNICIAN</span>
                          <span className="font-bold text-[#151515] text-xs">
                            {b.technicianName || "Assigned Specialist"}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#5B403A] font-mono">
                          {b.technicianEmail}
                        </span>
                      </div>
                    </div>

                    {/* Actions Grid: Two Balanced Side-by-Side Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Timeline Button */}
                      <button
                        type="button"
                        onClick={() => setTimelineBooking(b)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FEF9EF] hover:bg-[#FCD03D] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#FF5B2E]" />
                        <span>Timeline</span>
                      </button>

                      {/* Primary Action Button */}
                      {isCompletedUnpaid ? (
                        <button
                          type="button"
                          onClick={() => handlePayNow(b._id)}
                          disabled={isProcessingPayment}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Routing...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Now</span>
                            </>
                          )}
                        </button>
                      ) : isPaid ? (
                        <div className="flex items-center gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => {
                              const ok = generateInvoicePDF({
                                bookingId: b._id,
                                serviceTitle: b.serviceTitle,
                                category: b.category,
                                customerName: b.customerName,
                                customerEmail: b.customerEmail,
                                customerPhone: b.customerPhone,
                                address: b.address,
                                technicianName: b.technicianName,
                                technicianEmail: b.technicianEmail,
                                preferredDate: b.preferredDate,
                                timeSlot: b.timeSlot,
                                problemDescription: b.problemDescription,
                                basePrice: b.basePrice,
                                finalAmount: b.finalAmount || b.basePrice || 0,
                                paidAt: b.paidAt,
                                transactionId: b.transactionId,
                              });
                              if (ok) toast.success("Invoice downloaded!");
                            }}
                            className="inline-flex items-center justify-center gap-1.5 flex-1 py-2 bg-[#FEF9EF] hover:bg-[#FCD03D] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#FF5B2E]" />
                            <span>Invoice</span>
                          </button>

                          {b.isReviewed ? (
                            <div className="inline-flex items-center justify-center gap-1 flex-1 py-2 bg-[#FEF9EF] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] font-mono text-xs font-bold select-none">
                              <Star className="w-3.5 h-3.5 fill-[#FCD03D] text-[#151515]" />
                              <span>{b.review?.rating || 5}★</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setReviewBooking(b)}
                              className="inline-flex items-center justify-center gap-1 flex-1 py-2 bg-[#FCD03D] hover:bg-[#FFE072] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] transition-all cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 fill-[#151515] text-[#151515]" />
                              <span>Review</span>
                            </button>
                          )}
                        </div>
                      ) : isRequested ? (
                        <button
                          type="button"
                          onClick={() => setTargetBooking(b)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-[#DC2626] text-[#DC2626] hover:text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#DC2626] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#F2EDE3] text-[#5B403A] border-2 border-[#151515]/30 rounded-[6px] font-mono text-xs select-none">
                          <Lock className="w-3 h-3 text-[#5B403A]" />
                          <span>In Bay</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!targetBooking}
        onClose={() => setTargetBooking(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Repair Order?"
        description={`Are you sure you want to cancel the service order for "${targetBooking?.serviceTitle}"? Once cancelled, this ticket will be removed from dispatch and cannot be reactivated.`}
        badge="WARNING // DE-ESCALATE JOB"
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        variant="danger"
        isLoading={isPending}
      />

      {/* Live Job Timeline Tracker Modal */}
      <JobTimelineModal
        booking={timelineBooking}
        onClose={() => setTimelineBooking(null)}
      />

      {/* Verified Rating & Review Modal */}
      <LeaveReviewModal
        booking={reviewBooking}
        onClose={() => setReviewBooking(null)}
        onSuccess={() => {
          setReviewBooking(null);
          router.refresh();
        }}
      />
    </div>
  );
}