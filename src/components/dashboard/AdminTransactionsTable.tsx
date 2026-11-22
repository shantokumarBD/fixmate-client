"use client";

import React, { useState } from "react";
import { Payment } from "@/types/payment";
import { StatsCard } from "@/components/shared/StatsCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  CreditCard,
  Calendar,
  Inbox,
  Receipt,
  X,
  User,
  Wrench,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface AdminTransactionsTableProps {
  payments: Payment[];
  totalRevenue: number;
}

export function AdminTransactionsTable({
  payments,
  totalRevenue,
}: AdminTransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectPayment, setInspectPayment] = useState<Payment | null>(null);

  const totalCount = payments.length;
  const aov = totalCount > 0 ? totalRevenue / totalCount : 0;
  const platformFee = totalRevenue * 0.1; // আনুমানিক ১০% প্ল্যাটফর্ম ফি

 
  const filteredPayments = payments.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.serviceTitle?.toLowerCase().includes(q) ||
        p.customerName?.toLowerCase().includes(q) ||
        p.customerEmail?.toLowerCase().includes(q) ||
        p.technicianName?.toLowerCase().includes(q) ||
        p.stripeSessionId?.toLowerCase().includes(q) ||
        p.transactionId?.toLowerCase().includes(q) ||
        p._id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ================= 4 FINANCIAL METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Gross Settled Volume"
          value={formatCurrency(totalRevenue)}
          subtitle="Total Stripe payments cleared"
          accentColor="text-[#16A34A]"
          icon={<DollarSign className="w-5 h-5 text-[#16A34A]" />}
        />
        <StatsCard
          title="Total Transactions"
          value={totalCount}
          subtitle="Processed repair invoices"
          accentColor="text-[#2563EB]"
          icon={<CreditCard className="w-5 h-5 text-[#2563EB]" />}
        />
        <StatsCard
          title="Average Order Value"
          value={formatCurrency(aov)}
          subtitle="Per completed work order"
          accentColor="text-[#FF5B2E]"
          icon={<TrendingUp className="w-5 h-5 text-[#FF5B2E]" />}
        />
        <StatsCard
          title="Platform Take (~10%)"
          value={formatCurrency(platformFee)}
          subtitle="Retained escrow commission"
          icon={<Receipt className="w-5 h-5 text-[#151515]" />}
        />
      </div>

      {/* ================= SEARCH BAR & AUDIT COUNTER ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5B403A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Stripe ID, customer, technician, or service..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all rounded-[6px]"
          />
        </div>

        <div className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 self-end sm:self-center">
          <span>CLEARED TRANSACTIONS:</span>
          <span className="font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
            {filteredPayments.length}
          </span>
        </div>
      </div>

      {/* ================= 5-COLUMN TRANSACTIONS TABLE ================= */}
      <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center bg-[#FEF9EF]/30">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <Inbox className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              No Transactions Found
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-sm mt-1">
              No cleared Stripe transactions match your search keywords or exist in the audit log.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-bold w-[30%]">Transaction Reference</th>
                  <th className="py-3.5 px-5 font-bold w-[25%]">Parties Involved</th>
                  <th className="py-3.5 px-5 font-bold w-[18%]">Settled Amount</th>
                  <th className="py-3.5 px-5 font-bold w-[17%]">Settlement Date</th>
                  <th className="py-3.5 px-5 font-bold w-[10%] text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#151515] font-sans text-xs sm:text-sm">
                {filteredPayments.map((p) => {
                  const displayTxnId = p.stripeSessionId
                    ? `${p.stripeSessionId.slice(0, 14)}...`
                    : `#TXN-${p._id.slice(-6).toUpperCase()}`;

                  return (
                    <tr key={p._id} className="hover:bg-[#FEF9EF]/50 transition-colors">
                      {/* 1. Transaction Reference & Service */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold bg-[#FEF9EF] border border-[#151515] px-1.5 py-0.5 rounded text-[#16A34A]">
                              {displayTxnId}
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.2 rounded">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>CLEARED</span>
                            </span>
                          </div>
                          <span className="font-heading font-bold text-[#151515] text-sm leading-snug line-clamp-2 max-w-sm">
                            {p.serviceTitle || "Hardware Diagnostic & Repair"}
                          </span>
                        </div>
                      </td>

                      {/* 2. Parties Involved */}
                      <td className="py-4 px-5">
                        <div className="space-y-2">
                          {/* Customer */}
                          <div className="flex items-start gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                            <div className="leading-tight">
                              <span className="font-bold text-[#151515] block">{p.customerName}</span>
                              <span className="font-mono text-[11px] text-[#5B403A]">{p.customerEmail}</span>
                            </div>
                          </div>
                          {/* Technician */}
                          <div className="flex items-start gap-1.5 pt-1.5 border-t border-neutral-200">
                            <Wrench className="w-3.5 h-3.5 text-[#FF5B2E] shrink-0 mt-0.5" />
                            <div className="leading-tight">
                              <span className="font-bold text-[#151515] block">{p.technicianName}</span>
                              <span className="font-mono text-[11px] text-[#5B403A] truncate max-w-[180px] block" title={p.technicianEmail}>
                                {p.technicianEmail}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Settled Amount */}
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <span className="font-mono font-black text-base text-[#151515] block">
                            {formatCurrency(p.amount)}
                          </span>
                          <span className="font-mono text-[10px] uppercase font-bold text-[#5B403A] bg-[#FEF9EF] border border-[#151515] px-1.5 py-0.2 rounded inline-block">
                            STRIPE // {p.currency?.toUpperCase() || "USD"}
                          </span>
                        </div>
                      </td>

                      {/* 4. Settlement Date */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-[#151515]">
                          <Calendar className="w-3.5 h-3.5 text-[#5B403A] shrink-0" />
                          <span>{p.paidAt ? formatDate(p.paidAt) : "Completed"}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#5B403A] block mt-0.5">
                          Instant Bank Escrow
                        </span>
                      </td>

                      {/* 5. Audit Receipt Action */}
                      <td className="py-4 px-5 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => setInspectPayment(p)}
                          className="px-3 py-1.5 bg-white hover:bg-[#FCD03D] text-[#151515] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center gap-1.5 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0"
                          title="View Official Receipt"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: STRIPE AUDIT RECEIPT ================= */}
      {inspectPayment && (
        <div className="fixed inset-0 z-50 bg-[#151515]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[6px_6px_0px_#151515] w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#16A34A] border border-[#151515]"></span>
                <h3 className="font-heading font-extrabold text-base text-[#151515]">
                  Official Payment Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectPayment(null)}
                className="p-1 hover:bg-[#FEF9EF] rounded border border-transparent hover:border-[#151515] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#FEF9EF] border-2 border-[#151515] rounded-[8px] space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#151515]/20 pb-2">
                <span className="text-[#5B403A]">STATUS:</span>
                <span className="font-bold text-[#16A34A]">CLEARED // PAID</span>
              </div>
              <div className="flex justify-between border-b border-[#151515]/20 pb-2">
                <span className="text-[#5B403A]">SETTLED AMOUNT:</span>
                <span className="font-black text-sm text-[#151515]">
                  {formatCurrency(inspectPayment.amount)}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#151515]/20 pb-2">
                <span className="text-[#5B403A]">GATEWAY:</span>
                <span className="font-bold text-[#151515]">STRIPE CHECKOUT</span>
              </div>
              <div>
                <span className="text-[#5B403A] block mb-1">STRIPE SESSION ID:</span>
                <span className="font-mono text-[10px] break-all bg-white p-1.5 border border-[#151515] rounded block">
                  {inspectPayment.stripeSessionId || "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-2 font-sans text-xs">
              <div className="p-2.5 bg-white border border-[#151515] rounded flex justify-between items-center">
                <span className="text-[#5B403A]">Customer:</span>
                <span className="font-bold text-[#151515]">{inspectPayment.customerName}</span>
              </div>
              <div className="p-2.5 bg-white border border-[#151515] rounded flex justify-between items-center">
                <span className="text-[#5B403A]">Technician:</span>
                <span className="font-bold text-[#151515]">{inspectPayment.technicianName}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setInspectPayment(null)}
                className="px-4 py-2 bg-[#151515] text-white border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase cursor-pointer hover:bg-[#303030]"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}