"use client";

import React, { useState } from "react";
import { Booking } from "@/types/booking";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaymentBadge } from "@/components/shared/PaymentBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  Calendar,
  Phone,
  MapPin,
  Inbox,
  FileText,
  X,
  Wrench,
  User,
} from "lucide-react";

interface AdminBookingsTableProps {
  bookings: Booking[];
}

type TabType = "all" | "requested" | "accepted" | "in-progress" | "completed" | "cancelled";

export function AdminBookingsTable({ bookings }: AdminBookingsTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);

 
  const tabs = [
    { id: "all" as TabType, label: "All Bookings", count: bookings.length },
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
      label: "Cancelled",
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
        b.customerEmail?.toLowerCase().includes(q) ||
        b.customerPhone?.toLowerCase().includes(q) ||
        b.technicianName?.toLowerCase().includes(q) ||
        b.technicianEmail?.toLowerCase().includes(q) ||
        b._id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
            placeholder="Search by ticket ID, customer, technician, or service..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all rounded-[6px]"
          />
        </div>

        <div className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 self-end sm:self-center">
          <span>GLOBAL ORDERS:</span>
          <span className="font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
            {filteredBookings.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Spacious Bookings Table */}
      <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center bg-[#FEF9EF]/30">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <Inbox className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              No Work Orders Found
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-sm mt-1">
              No platform repair orders match your selected status tab or search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-bold w-[32%]">Work Order & Service</th>
                  <th className="py-3.5 px-5 font-bold w-[25%]">Parties Involved</th>
                  <th className="py-3.5 px-5 font-bold w-[18%]">Schedule</th>
                  <th className="py-3.5 px-5 font-bold w-[15%]">Settlement & Status</th>
                  <th className="py-3.5 px-5 font-bold w-[10%] text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#151515] font-sans text-xs sm:text-sm">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[#FEF9EF]/50 transition-colors">
                    {/* 1. Work Order & Service Title */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold bg-[#FEF9EF] border border-[#151515] px-1.5 py-0.5 rounded text-[#FF5B2E]">
                            #{b._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="font-mono text-[10px] uppercase font-bold text-[#5B403A] bg-[#F2EDE3] px-1.5 py-0.5 rounded">
                            {b.category}
                          </span>
                        </div>
                        <span className="font-heading font-bold text-[#151515] text-sm leading-snug line-clamp-2 max-w-sm">
                          {b.serviceTitle}
                        </span>
                      </div>
                    </td>

                    {/* 2. Parties (Customer + Assigned Tech) */}
                    <td className="py-4 px-5">
                      <div className="space-y-2">
                        {/* Customer */}
                        <div className="flex items-start gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="font-bold text-[#151515] block">{b.customerName}</span>
                            <span className="font-mono text-[11px] text-[#5B403A]">{b.customerPhone}</span>
                          </div>
                        </div>
                        {/* Technician */}
                        <div className="flex items-start gap-1.5 pt-1.5 border-t border-neutral-200">
                          <Wrench className="w-3.5 h-3.5 text-[#FF5B2E] shrink-0 mt-0.5" />
                          <div className="leading-tight">
                            <span className="font-bold text-[#151515] block">{b.technicianName}</span>
                            <span className="font-mono text-[11px] text-[#5B403A] truncate max-w-[180px] block" title={b.technicianEmail}>
                              {b.technicianEmail}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 3. Schedule */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 font-bold text-[#151515]">
                        <Calendar className="w-3.5 h-3.5 text-[#5B403A] shrink-0" />
                        <span>{formatDate(b.preferredDate)}</span>
                      </div>
                      {b.timeSlot && (
                        <span className="font-mono text-[11px] text-[#5B403A] block mt-1">
                          {b.timeSlot}
                        </span>
                      )}
                    </td>

                    {/* 4. Settlement & Status */}
                    <td className="py-4 px-5">
                      <div className="space-y-1.5">
                        <span className="font-mono font-black text-sm text-[#151515] block">
                          {formatCurrency(b.finalAmount || b.basePrice || 0)}
                        </span>
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={b.status} />
                          <PaymentBadge status={b.paymentStatus} />
                        </div>
                      </div>
                    </td>

                    {/* 5. Audit Action Button */}
                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => setInspectBooking(b)}
                        className="px-3 py-1.5 bg-white hover:bg-[#FCD03D] text-[#151515] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center gap-1.5 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0"
                        title="Inspect Ticket Details"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: INSPECT TICKET DETAILS ================= */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 bg-[#151515]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[6px_6px_0px_#151515] w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
              <div className="flex items-center gap-2">
                <span className="bg-[#FF5B2E] text-white border-2 border-[#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
                  TICKET #{inspectBooking._id.slice(-6).toUpperCase()}
                </span>
                <h3 className="font-heading font-extrabold text-base text-[#151515] truncate max-w-xs">
                  {inspectBooking.serviceTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectBooking(null)}
                className="p-1 hover:bg-[#FEF9EF] rounded border border-transparent hover:border-[#151515] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#5B403A] block mb-1">
                  Customer Problem Scope:
                </span>
                <div className="p-3 bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] text-[#151515] leading-relaxed whitespace-pre-wrap font-sans">
                  {inspectBooking.problemDescription}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-white border border-[#151515] rounded">
                  <span className="font-mono text-[10px] text-[#5B403A] block">Customer</span>
                  <span className="font-bold text-[#151515]">{inspectBooking.customerName}</span>
                  <span className="font-mono text-[11px] text-[#2563EB] block">{inspectBooking.customerPhone}</span>
                </div>
                <div className="p-2.5 bg-white border border-[#151515] rounded">
                  <span className="font-mono text-[10px] text-[#5B403A] block">Assigned Technician</span>
                  <span className="font-bold text-[#151515]">{inspectBooking.technicianName}</span>
                  <span className="font-mono text-[11px] text-[#5B403A] block">{inspectBooking.technicianEmail}</span>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-[#151515] rounded">
                <span className="font-mono text-[10px] text-[#5B403A] block">Service Location / Address</span>
                <span className="font-bold text-[#151515] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#5B403A]" />
                  <span>{inspectBooking.address}</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t-2 border-[#151515]">
              <div className="flex items-center gap-2">
                <StatusBadge status={inspectBooking.status} />
                <PaymentBadge status={inspectBooking.paymentStatus} />
              </div>
              <button
                type="button"
                onClick={() => setInspectBooking(null)}
                className="px-4 py-2 bg-[#151515] text-white border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}