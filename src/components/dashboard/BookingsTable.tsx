// File: src/components/dashboard/BookingsTable.tsx
"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Booking } from "@/types/booking";
import { cancelBookingAction } from "@/actions/booking";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaymentBadge } from "@/components/shared/PaymentBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { Search, Ban, Lock, ArrowRight, Inbox } from "lucide-react";

interface BookingsTableProps {
  bookings: Booking[];
}

type FilterTab = "all" | "requested" | "accepted" | "in-progress" | "completed" | "cancelled";

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [targetBooking, setTargetBooking] = useState<Booking | null>(null);
  const [isPending, startTransition] = useTransition();

  // ১. সাধারণ ডাইনামিক ট্যাব ও কাউন্টার (No useMemo needed)
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

  // ২. প্লেইন ফিল্টারিং লজিক (Single Source of Truth)
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

  // ৩. ক্যানসেল হ্যান্ডলার: অ্যাকশন শেষে router.refresh() কল হলেই Next.js সার্ভার থেকে প্রপস আপডেট করে দেবে
  const handleConfirmCancel = () => {
    if (!targetBooking) return;

    startTransition(async () => {
      const res = await cancelBookingAction(targetBooking._id);
      if (res.success) {
        toast.success(res.message || "Booking cancelled successfully");
        setTargetBooking(null);
        router.refresh(); // সার্ভার থেকে নতুন bookings ফেচ হয়ে অটোমেটিক রেন্ডার হবে
      } else {
        toast.error(res.error || "Failed to cancel booking");
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
          /* Empty State */
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
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase">
                    <th className="py-3 px-4 font-bold tracking-wider">Ticket & Service</th>
                    <th className="py-3 px-4 font-bold tracking-wider">Technician</th>
                    <th className="py-3 px-4 font-bold tracking-wider">Schedule</th>
                    <th className="py-3 px-4 font-bold tracking-wider">Quote / Escrow</th>
                    <th className="py-3 px-4 font-bold tracking-wider">Status</th>
                    <th className="py-3 px-4 font-bold tracking-wider">Payment</th>
                    <th className="py-3 px-4 font-bold tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#151515] font-sans text-xs sm:text-sm">
                  {filteredBookings.map((b) => {
                    const ticketCode = `#FX-${b._id?.slice(-4).toUpperCase()}`;
                    const isRequested = b.status?.toLowerCase() === "requested";

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

                        {/* Booking Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={b.status} />
                        </td>

                        {/* Payment Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <PaymentBadge status={b.paymentStatus} />
                        </td>

                        {/* Action Column: R18 Enforcement */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          {isRequested ? (
                            <button
                              type="button"
                              onClick={() => setTargetBooking(b)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#FEE2E2] text-[#DC2626] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#DC2626] shadow-[2px_2px_0px_#DC2626] rounded-[4px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#5B403A] bg-[#F2EDE3] border border-[#151515]/30 px-2 py-0.5 rounded-[4px]">
                              <Lock className="w-3 h-3" />
                              <span>Locked in bay</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y-2 divide-[#151515]">
              {filteredBookings.map((b) => {
                const ticketCode = `#FX-${b._id?.slice(-4).toUpperCase()}`;
                const isRequested = b.status?.toLowerCase() === "requested";

                return (
                  <div key={b._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[11px] text-[#FF5B2E] font-bold">
                          {ticketCode}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-[#151515] leading-snug">
                          {b.serviceTitle}
                        </h4>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#FEF9EF] p-2.5 border-2 border-[#151515] rounded-[6px]">
                      <div>
                        <span className="text-[#5B403A] block text-[10px]">SCHEDULE:</span>
                        <span className="font-bold text-[#151515]">
                          {formatDate(b.preferredDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#5B403A] block text-[10px]">ESTIMATE:</span>
                        <span className="font-bold text-[#151515]">
                          {formatCurrency(b.finalAmount || b.basePrice || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#5B403A] block text-[10px]">TECHNICIAN:</span>
                        <span className="font-bold text-[#151515] truncate block">
                          {b.technicianName || "Specialist"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#5B403A] block text-[10px]">PAYMENT:</span>
                        <PaymentBadge status={b.paymentStatus} />
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      {isRequested ? (
                        <button
                          type="button"
                          onClick={() => setTargetBooking(b)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FEE2E2] text-[#DC2626] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#DC2626] shadow-[2px_2px_0px_#DC2626] rounded-[4px] cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      ) : (
                        <span className="font-mono text-[11px] text-[#5B403A] flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Order locked in bay</span>
                        </span>
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
    </div>
  );
}