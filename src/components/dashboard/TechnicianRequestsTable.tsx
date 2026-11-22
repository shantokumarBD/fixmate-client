"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Booking } from "@/types/booking";
import { updateBookingStatusAction } from "@/actions/booking";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaymentBadge } from "@/components/shared/PaymentBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  XCircle,
  Wrench,
  Sparkles,
  Inbox,
  Calendar,
  MapPin,
  Phone,
  FileText,
  DollarSign,
  Loader2,
  X,
} from "lucide-react";

interface TechnicianRequestsTableProps {
  bookings: Booking[];
}

type TabType = "all" | "requested" | "accepted" | "in-progress" | "completed" | "cancelled";

export function TechnicianRequestsTable({ bookings }: TechnicianRequestsTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Action states
  const [targetRejectBooking, setTargetRejectBooking] = useState<Booking | null>(null);
  const [targetCompleteBooking, setTargetCompleteBooking] = useState<Booking | null>(null);
  const [finalAmountInput, setFinalAmountInput] = useState<string | number>("");
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const tabs = [
    { id: "all" as TabType, label: "All Requests", count: bookings.length },
    {
      id: "requested" as TabType,
      label: "Requested",
      count: bookings.filter((b) => b.status === "requested").length,
    },
    {
      id: "accepted" as TabType,
      label: "Accepted",
      count: bookings.filter((b) => b.status === "accepted").length,
    },
    {
      id: "in-progress" as TabType,
      label: "In Progress",
      count: bookings.filter((b) => ["in-progress", "in_progress"].includes(b.status)).length,
    },
    {
      id: "completed" as TabType,
      label: "Completed",
      count: bookings.filter((b) => b.status === "completed").length,
    },
    {
      id: "cancelled" as TabType,
      label: "Cancelled / Rejected",
      count: bookings.filter((b) => ["cancelled", "rejected"].includes(b.status)).length,
    },
  ];

  
  const filteredBookings = bookings.filter((b) => {
    if (activeTab !== "all") {
      if (activeTab === "in-progress") {
        if (!["in-progress", "in_progress"].includes(b.status)) return false;
      } else if (activeTab === "cancelled") {
        if (!["cancelled", "rejected"].includes(b.status)) return false;
      } else if (b.status !== activeTab) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        b.serviceTitle?.toLowerCase().includes(q) ||
        b.customerName?.toLowerCase().includes(q) ||
        b.customerPhone?.toLowerCase().includes(q) ||
        b._id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  
  const handleTransition = (bookingId: string, nextStatus: string, amount?: number) => {
    setProcessingId(bookingId);
    startTransition(async () => {
      const res = await updateBookingStatusAction(bookingId, nextStatus, amount);
      if (res.success) {
        toast.success(res.message || `Work order updated to ${nextStatus}`);
        setTargetCompleteBooking(null);
        setTargetRejectBooking(null);
        setInspectBooking(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update work order status");
      }
      setProcessingId(null);
    });
  };

  
  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCompleteBooking) return;

    const numericAmount = Number(finalAmountInput);
    if (!numericAmount || numericAmount <= 0 || isNaN(numericAmount)) {
      toast.error("Please enter a valid final repair settlement amount ($ > 0)");
      return;
    }

    handleTransition(targetCompleteBooking._id, "completed", numericAmount);
  };

  return (
    <div className="space-y-5">
      {/* Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5B403A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, ticket ID, or service..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all rounded-[6px]"
          />
        </div>

        <div className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 self-end sm:self-center">
          <span>PIPELINE UNITS:</span>
          <span className="font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
            {filteredBookings.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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

      {/* Table Container */}
      <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center bg-[#FEF9EF]/30">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <Inbox className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              No Job Requests Found
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-sm mt-1">
              {searchQuery || activeTab !== "all"
                ? "No hardware requests match your selected status tab or search filter."
                : "You currently have no incoming repair bookings in the pipeline."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[820px] lg:min-w-0">
              <thead>
                <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-4 font-extrabold min-w-[240px]">
                    Ticket & Service
                  </th>
                  <th className="py-3 px-3.5 font-extrabold min-w-[170px]">
                    Customer Contact
                  </th>
                  <th className="py-3 px-3.5 font-extrabold min-w-[150px]">
                    Schedule
                  </th>
                  <th className="py-3 px-3.5 font-extrabold whitespace-nowrap">
                    Quote / Escrow
                  </th>
                  <th className="py-3 px-3.5 font-extrabold whitespace-nowrap text-center">
                    Stage Status
                  </th>
                  {/* Sufficient minimum width for stacked actions */}
                  <th className="py-3 px-3.5 sm:px-4 font-extrabold text-right whitespace-nowrap min-w-[150px]">
                    Pipeline Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#151515] font-sans">
                {filteredBookings.map((b) => {
                  const isProcessing = processingId === b._id && isPending;

                  return (
                    <tr key={b._id} className="group hover:bg-[#FEF9EF]/50 transition-colors">
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex flex-col min-w-0 max-w-[220px] sm:max-w-[260px]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-black bg-[#FEF9EF] border border-[#151515] px-1.5 py-0.5 rounded text-[#FF5B2E] shadow-[1px_1px_0px_#151515]">
                              #{b._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="font-heading font-extrabold text-sm text-[#151515] truncate">
                              {b.serviceTitle}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="font-mono text-[10px] uppercase font-bold text-[#151515] bg-[#F2EDE3] border border-[#151515] px-1.5 py-0.2 rounded">
                              {b.category}
                            </span>

                            {/* Highlighted Neobrutalist Problem Button */}
                            <button
                              type="button"
                              onClick={() => setInspectBooking(b)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FCD03D] hover:bg-[#FFE580] text-[#151515] border-2 border-[#151515] shadow-[1.5px_1.5px_0px_#151515] rounded-[4px] font-mono text-[11px] font-extrabold uppercase transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                              title="Inspect Problem Description"
                            >
                              <FileText className="w-3 h-3 text-[#151515]" />
                              <span>View Problem</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Customer Contact */}
                      <td className="py-3 px-3.5">
                        <span className="font-heading font-extrabold text-sm text-[#151515] block truncate max-w-[160px]">
                          {b.customerName}
                        </span>
                        <a
                          href={`tel:${b.customerPhone}`}
                          className="font-mono text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1.5 mt-0.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#5B403A]" />
                          <span>{b.customerPhone}</span>
                        </a>
                        <span
                          className="font-mono text-[11px] text-[#5B403A] flex items-center gap-1.5 mt-0.5 max-w-[180px] truncate"
                          title={b.address}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#5B403A]" />
                          <span className="truncate">{b.address}</span>
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5 font-heading font-bold text-sm text-[#151515]">
                          <Calendar className="w-3.5 h-3.5 text-[#5B403A] shrink-0" />
                          <span>{formatDate(b.preferredDate)}</span>
                        </div>
                        {b.timeSlot && (
                          <span className="font-mono text-xs text-[#5B403A] block ml-5 mt-0.5">
                            {b.timeSlot}
                          </span>
                        )}
                      </td>

                      {/* Quote & Payment */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="font-mono font-black text-base text-[#151515]">
                          {formatCurrency(b.finalAmount || b.basePrice || 0)}
                        </div>
                        <div className="mt-1">
                          <PaymentBadge status={b.paymentStatus} />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-center">
                        <StatusBadge status={b.status} />
                      </td>

                      {/* Pipeline Actions (Clean & Non-Overflowing) */}
                      <td className="py-3 px-3.5 sm:px-4 whitespace-nowrap text-right">
                        {isProcessing ? (
                          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#FF5B2E] font-bold">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : b.status === "requested" ? (
                          /* Vertically Stacked Up-Down Buttons */
                          <div className="flex flex-col gap-1.5 items-end justify-center">
                            {/* Accept Button */}
                            <button
                              type="button"
                              onClick={() => handleTransition(b._id, "accepted")}
                              className="w-[110px] py-1.5 bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0] border-2 border-[#151515] rounded-[5px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                              title="Accept Job Order"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>

                            {/* Decline / Reject Button */}
                            <button
                              type="button"
                              onClick={() => setTargetRejectBooking(b)}
                              className="w-[110px] py-1.5 bg-white text-[#DC2626] hover:bg-[#FEE2E2] border-2 border-[#151515] rounded-[5px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                              title="Decline Job Order"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </div>
                        ) : b.status === "accepted" ? (
                          <div className="flex flex-col gap-1.5 items-end justify-center">
                            <button
                              type="button"
                              onClick={() => handleTransition(b._id, "in-progress")}
                              className="w-[135px] py-1.5 bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A] border-2 border-[#151515] rounded-[5px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Start Repair</span>
                            </button>
                          </div>
                        ) : ["in-progress", "in_progress"].includes(b.status) ? (
                          <div className="flex flex-col gap-1.5 items-end justify-center">
                            {/* Complete Job Button (w-[135px] eliminates overflow) */}
                            <button
                              type="button"
                              onClick={() => {
                                setTargetCompleteBooking(b);
                                // Prefills directly as string so no leading 0 occurs
                                setFinalAmountInput(String(b.finalAmount || b.basePrice || ""));
                              }}
                              className="w-[135px] py-1.5 bg-[#FF5B2E] text-white hover:bg-[#B22B00] border-2 border-[#151515] rounded-[5px] shadow-[2px_2px_0px_#000000] font-heading font-bold text-xs uppercase tracking-normal transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                            >
                              <Sparkles className="w-3.5 h-3.5 shrink-0" />
                              <span>Complete Job</span>
                            </button>
                          </div>
                        ) : b.status === "completed" ? (
                          <span className="w-[110px] text-center font-mono text-xs font-bold text-[#16A34A] bg-[#DCFCE7] border-2 border-[#151515] py-1 rounded-[5px] shadow-[1px_1px_0px_#151515] inline-block">
                            ✓ Finished
                          </span>
                        ) : (
                          <span className="w-[110px] text-center font-mono text-xs font-bold text-[#5B403A] bg-[#F2EDE3] border border-[#151515] py-1 rounded-[5px] inline-block">
                            Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: COMPLETE JOB & FINALIZE AMOUNT ================= */}
      {targetCompleteBooking && (
        <div className="fixed inset-0 z-50 bg-[#151515]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[6px_6px_0px_#151515] w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#FF5B2E] border-2 border-[#151515]"></span>
                <h3 className="font-heading font-extrabold text-lg text-[#151515]">
                  Complete Repair Job
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTargetCompleteBooking(null)}
                className="p-1 hover:bg-[#FEF9EF] rounded border border-transparent hover:border-[#151515] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-sans text-xs text-[#5B403A]">
              Confirm final hardware diagnostic settlement for ticket{" "}
              <strong>#{targetCompleteBooking._id.slice(-6).toUpperCase()}</strong>.
              This amount will be billed to customer <strong>{targetCompleteBooking.customerName}</strong> via Stripe.
            </p>

            <form onSubmit={handleConfirmCompletion} className="space-y-4 pt-2">
              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1">
                  Final Settlement Amount ($ USD) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#5B403A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={finalAmountInput}
                    // Auto-select on focus so typing replaces the number without backspacing
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Remove accidental leading zeroes (e.g. "030" -> "30")
                      if (val.length > 1 && val.startsWith("0") && !val.startsWith("0.")) {
                        setFinalAmountInput(val.replace(/^0+/, ""));
                      } else {
                        setFinalAmountInput(val);
                      }
                    }}
                    placeholder="Enter final amount"
                    className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] rounded-[6px] font-mono text-sm font-bold text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
                  />
                </div>
                <span className="font-mono text-[10px] text-[#5B403A] mt-1 block">
                  Original Base Quote: {formatCurrency(targetCompleteBooking.basePrice || 0)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#151515]">
                <button
                  type="button"
                  onClick={() => setTargetCompleteBooking(null)}
                  className="px-4 py-2 bg-white text-[#151515] border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase hover:bg-[#FEF9EF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Confirm & Issue Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: INSPECT PROBLEM DETAILS ================= */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 bg-[#151515]/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[8px_8px_0px_#151515] w-full max-w-lg my-8 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b-2 border-[#151515] bg-[#FEF9EF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#FCD03D] border-2 border-[#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase shadow-[1px_1px_0px_#151515]">
                  TICKET #{inspectBooking._id.slice(-6).toUpperCase()}
                </span>
                <h3 className="font-heading font-extrabold text-base text-[#151515] truncate max-w-xs">
                  {inspectBooking.serviceTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectBooking(null)}
                className="p-1 hover:bg-white rounded border border-transparent hover:border-[#151515] cursor-pointer"
              >
                <X className="w-5 h-5 text-[#151515]" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Problem Description */}
              <div>
                <span className="font-mono text-[11px] uppercase font-bold text-[#5B403A] block mb-1.5">
                  Customer Diagnostic Problem Description:
                </span>
                <div className="p-3.5 bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] text-xs sm:text-sm text-[#151515] leading-relaxed whitespace-pre-wrap font-sans">
                  {inspectBooking.problemDescription}
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white border-2 border-[#151515] rounded-[6px]">
                  <span className="font-mono text-[10px] text-[#5B403A] font-bold block uppercase">
                    Customer Contact
                  </span>
                  <span className="font-heading font-bold text-sm text-[#151515] block mt-0.5">
                    {inspectBooking.customerName}
                  </span>
                  <a
                    href={`tel:${inspectBooking.customerPhone}`}
                    className="font-mono text-xs text-[#2563EB] hover:underline block mt-0.5"
                  >
                    {inspectBooking.customerPhone}
                  </a>
                </div>

                <div className="p-3 bg-white border-2 border-[#151515] rounded-[6px]">
                  <span className="font-mono text-[10px] text-[#5B403A] font-bold block uppercase">
                    Repair Address
                  </span>
                  <span className="font-sans font-bold text-xs text-[#151515] block mt-0.5 line-clamp-2">
                    {inspectBooking.address}
                  </span>
                </div>
              </div>

              {/* Schedule and Quote */}
              <div className="p-3 bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] flex items-center justify-between font-mono text-xs">
                <span>
                  Schedule: <strong>{formatDate(inspectBooking.preferredDate)}</strong> {inspectBooking.timeSlot && `(${inspectBooking.timeSlot})`}
                </span>
                <span className="font-black text-[#151515]">
                  Quote: {formatCurrency(inspectBooking.finalAmount || inspectBooking.basePrice || 0)}
                </span>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 sm:p-5 border-t-2 border-[#151515] bg-[#FEF9EF] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setInspectBooking(null)}
                className="px-4 py-2 bg-white text-[#151515] hover:bg-[#F2EDE3] border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_#151515] cursor-pointer"
              >
                Close
              </button>

              {inspectBooking.status === "requested" && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const b = inspectBooking;
                      setInspectBooking(null);
                      setTargetRejectBooking(b);
                    }}
                    className="px-3 py-2 bg-white text-[#DC2626] hover:bg-[#FEE2E2] border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_#151515] cursor-pointer inline-flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleTransition(inspectBooking._id, "accepted");
                    }}
                    className="px-4 py-2 bg-[#10B981] text-white hover:bg-[#059669] border-2 border-[#151515] rounded-[6px] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000000] cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Job</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: REJECT CONFIRMATION ================= */}
      <ConfirmDialog
        isOpen={!!targetRejectBooking}
        onClose={() => setTargetRejectBooking(null)}
        onConfirm={() => targetRejectBooking && handleTransition(targetRejectBooking._id, "rejected")}
        title="Decline Hardware Repair Request?"
        description={`Are you sure you want to decline ticket #${targetRejectBooking?._id.slice(-6).toUpperCase()} for ${targetRejectBooking?.customerName}? This will cancel the booking.`}
        badge="DECLINE ORDER // CANCELLATION"
        confirmText="Yes, Decline Request"
        cancelText="Keep in Pipeline"
        variant="danger"
        isLoading={isPending}
      />
    </div>
  );
}