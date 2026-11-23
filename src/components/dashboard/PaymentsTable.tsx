"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Payment } from "@/types/payment";
import { PaymentBadge } from "@/components/shared/PaymentBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  Search,
  CreditCard,
  ArrowRight,
  Receipt,
  DollarSign,
  CheckCircle2,
  Copy,
  Check,
  FileText,
} from "lucide-react";
import { generateInvoicePDF } from "@/lib/pdf/generateInvoice";

interface PaymentsTableProps {
  payments: Payment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ১. সামারি ক্যালকুলেশন
  const totalAmountPaid = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalTransactions = payments.length;

  // ২. সার্চ ফিল্টারিং (Service title, Technician, বা Transaction ID দিয়ে)
  const filteredPayments = payments.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.serviceTitle?.toLowerCase().includes(q) ||
      p.technicianName?.toLowerCase().includes(q) ||
      p.transactionId?.toLowerCase().includes(q) ||
      p.stripeSessionId?.toLowerCase().includes(q)
    );
  });

  // ৩. Transaction ID ক্লিপবোর্ডে কপি করার হ্যান্ডলার
  const handleCopyTxn = (txnId: string) => {
    if (!txnId) return;
    navigator.clipboard.writeText(txnId);
    setCopiedId(txnId);
    toast.success("Transaction ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Settlement Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Metric 1: Total Settled */}
        <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase text-[#5B403A] tracking-wider block">
              TOTAL SETTLED AMOUNT
            </span>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] mt-1 block">
              {formatCurrency(totalAmountPaid)}
            </span>
            <span className="font-mono text-[11px] text-[#16A34A] flex items-center gap-1 mt-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Escrow Cleared
            </span>
          </div>
          <div className="w-12 h-12 bg-[#DCFCE7] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0px_#151515]">
            <DollarSign className="w-6 h-6 text-[#16A34A]" />
          </div>
        </div>

        {/* Metric 2: Completed Transactions */}
        <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase text-[#5B403A] tracking-wider block">
              SETTLED INVOICES
            </span>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] mt-1 block">
              {totalTransactions}
            </span>
            <span className="font-mono text-[11px] text-[#5B403A] mt-1 block font-semibold">
              Verified Stripe Receipts
            </span>
          </div>
          <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0px_#151515]">
            <Receipt className="w-6 h-6 text-[#151515]" />
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5B403A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service, technician or transaction ID..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all rounded-[6px]"
          />
        </div>

        <div className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 self-end sm:self-center">
          <span>MATCHING RECEIPTS:</span>
          <span className="font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
            {filteredPayments.length}
          </span>
        </div>
      </div>

      {/* Receipts Table Container */}
      <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center bg-[#FEF9EF]/30">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <CreditCard className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              No Payment Records Found
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-sm mt-1 mb-4">
              {searchQuery
                ? "No settled payments matched your search query."
                : "You have no completed payments yet. Payments are enabled after your technician completes the repair."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="font-mono text-xs font-bold text-[#FF5B2E] uppercase hover:underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            ) : (
              <Link
                href={ROUTES.CUSTOMER.BOOKINGS}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform rounded-[6px]"
              >
                <span>View Active Bookings</span>
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
                    <th className="py-3 px-4 font-bold tracking-wider min-w-[260px]">
                      Transaction ID
                    </th>
                    <th className="py-3 px-4 font-bold tracking-wider">
                      Service Title
                    </th>
                    <th className="py-3 px-4 font-bold tracking-wider">
                      Specialist
                    </th>
                    <th className="py-3 px-4 font-bold tracking-wider">
                      Settled Date
                    </th>
                    <th className="py-3 px-4 font-bold tracking-wider">
                      Amount Paid
                    </th>
                    <th className="py-3 px-4 font-bold tracking-wider text-center">
                      Status
                    </th>
                    <th className="py-3 px-4 font-bold tracking-wider text-right">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#151515] font-sans text-xs sm:text-sm">
                  {filteredPayments.map((p) => {
                    const txnId = p.transactionId || "TXN_STRIPE_VERIFIED";

                    return (
                      <tr key={p._id} className="hover:bg-[#FEF9EF]/50 transition-colors">
                        {/* Full Transaction ID with 1-Click Copy Button */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="inline-flex items-center gap-2 max-w-full">
                            <span
                              title={txnId}
                              className="font-bold text-[#151515] bg-[#F2EDE3] border-2 border-[#151515] shadow-[1.5px_1.5px_0px_#151515] px-2.5 py-1 rounded-[5px] text-xs select-all tracking-tight"
                            >
                              {txnId}
                            </span>
                            {p.transactionId && (
                              <button
                                type="button"
                                onClick={() => handleCopyTxn(p.transactionId)}
                                className="p-1.5 bg-white hover:bg-[#FCD03D] border-2 border-[#151515] shadow-[1.5px_1.5px_0px_#151515] rounded-[4px] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 shrink-0"
                                title="Copy Full Transaction ID"
                              >
                                {copiedId === p.transactionId ? (
                                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-[#151515]" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Service Title */}
                        <td className="py-3.5 px-4">
                          <span className="font-heading font-bold text-[#151515] block">
                            {p.serviceTitle}
                          </span>
                          <span className="font-mono text-[10px] text-[#5B403A]">
                            FixMate Escrow Cleared
                          </span>
                        </td>

                        {/* Technician */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-[#151515] block">
                            {p.technicianName || "Certified Specialist"}
                          </span>
                          <span className="font-mono text-[10px] text-[#5B403A]">
                            {p.technicianEmail}
                          </span>
                        </td>

                        {/* Settled Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs">
                          <span className="font-bold text-[#151515]">
                            {formatDate(p.paidAt)}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-extrabold text-[#151515]">
                          {formatCurrency(p.amount || 0)}
                        </td>

                        {/* Payment Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <PaymentBadge status="paid" />
                        </td>

                        {/* 1-Click PDF Invoice Download */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const ok = generateInvoicePDF({
                                bookingId: p.bookingId,
                                serviceTitle: p.serviceTitle,
                                customerName: p.customerName || "Customer",
                                customerEmail: p.customerEmail || "",
                                technicianName: p.technicianName || "Specialist",
                                technicianEmail: p.technicianEmail || "",
                                finalAmount: p.amount || 0,
                                paidAt: p.paidAt,
                                transactionId: p.transactionId,
                              });
                              if (ok) toast.success("Invoice downloaded successfully!");
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FEF9EF] hover:bg-[#FCD03D] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                            title="Download Official FixMate PDF Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#FF5B2E]" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y-2 divide-[#151515]">
              {filteredPayments.map((p) => (
                <div key={p._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* Mobile Full ID & Copy Button */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-[10px] font-bold text-[#151515] bg-[#F2EDE3] border border-[#151515] px-1.5 py-0.5 rounded break-all">
                          {p.transactionId}
                        </span>
                        {p.transactionId && (
                          <button
                            type="button"
                            onClick={() => handleCopyTxn(p.transactionId)}
                            className="p-1 bg-white border border-[#151515] rounded cursor-pointer shrink-0"
                            title="Copy ID"
                          >
                            {copiedId === p.transactionId ? (
                              <Check className="w-3 h-3 text-[#16A34A]" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#151515]" />
                            )}
                          </button>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[#151515]">
                        {p.serviceTitle}
                      </h4>
                    </div>
                    <PaymentBadge status="paid" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#FEF9EF] p-2.5 border-2 border-[#151515] rounded-[6px]">
                    <div>
                      <span className="text-[#5B403A] block text-[10px]">PAID ON:</span>
                      <span className="font-bold text-[#151515]">
                        {formatDate(p.paidAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#5B403A] block text-[10px]">AMOUNT:</span>
                      <span className="font-bold text-[#151515]">
                        {formatCurrency(p.amount || 0)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#5B403A] block text-[10px]">TECHNICIAN:</span>
                      <span className="font-bold text-[#151515]">
                        {p.technicianName} ({p.technicianEmail})
                      </span>
                    </div>
                  </div>

                  {/* Mobile 1-Click Invoice Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const ok = generateInvoicePDF({
                        bookingId: p.bookingId,
                        serviceTitle: p.serviceTitle,
                        customerName: p.customerName || "Customer",
                        customerEmail: p.customerEmail || "",
                        technicianName: p.technicianName || "Specialist",
                        technicianEmail: p.technicianEmail || "",
                        finalAmount: p.amount || 0,
                        paidAt: p.paidAt,
                        transactionId: p.transactionId,
                      });
                      if (ok) toast.success("Invoice downloaded successfully!");
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-[#FEF9EF] hover:bg-[#FCD03D] text-[#151515] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#FF5B2E]" />
                    <span>Download PDF Invoice</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}