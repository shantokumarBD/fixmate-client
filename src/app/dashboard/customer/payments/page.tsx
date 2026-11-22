import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { getMyPayments } from "@/lib/api/payments";
import { PaymentsTable } from "@/components/dashboard/PaymentsTable";
import { CalendarCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment History | FixMate",
};

export default async function CustomerPaymentsPage() {
  // Role Guard: Customer only
  await requireRole("customer");

  // Fetch verified customer payment records
  const payments = await getMyPayments();

  return (
    <div className="space-y-6 pb-10">
      {/* Station Header */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              STATION 03 // SETTLEMENTS
            </span>
            <span className="font-mono text-xs text-[#5B403A]">ESCROW: VERIFIED</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            Payment & Transaction Receipts
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Review Stripe escrow releases, diagnostic fee receipts, and settled invoices.
          </p>
        </div>

        <Link
          href={ROUTES.CUSTOMER.BOOKINGS}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all rounded-[6px] shrink-0"
        >
          <CalendarCheck className="w-4 h-4 text-[#FF5B2E]" />
          <span>My Bookings</span>
        </Link>
      </div>

      {/* Payments Table */}
      <PaymentsTable payments={payments} />
    </div>
  );
}