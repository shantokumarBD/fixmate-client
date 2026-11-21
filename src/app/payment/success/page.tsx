import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Receipt,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { verifyPaymentSession } from "@/lib/api/payments";
import { requireRole } from "@/lib/auth/session";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Successful | FixMate",
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  await requireRole("customer");
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect(ROUTES.CUSTOMER.PAYMENTS);
  }

  // Idempotently verify payment on Express backend
  const result = await verifyPaymentSession(session_id);

  if (!result.success || !result.payment) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border-2 border-[#151515] shadow-[6px_6px_0px_#151515] rounded-[10px] p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-[#FEE2E2] border-2 border-[#DC2626] rounded-full flex items-center justify-center mx-auto shadow-[2px_2px_0px_#DC2626]">
            <AlertTriangle className="w-7 h-7 text-[#DC2626]" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-[#151515]">
            Verification Incomplete
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#5B403A]">
            {result.message || "We could not immediately verify your payment session with Stripe."}
          </p>
          <Link
            href={ROUTES.CUSTOMER.PAYMENTS}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] font-heading font-bold text-xs uppercase tracking-wider rounded-[6px]"
          >
            <span>Check Payment History</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  const payment = result.payment;

  return (
    <main className="min-h-[85vh] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white border-2 border-[#151515] shadow-[8px_8px_0px_#151515] rounded-[12px] overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-[#10B981] border-b-2 border-[#151515] p-6 text-center text-white">
          <div className="w-12 h-12 bg-white border-2 border-[#151515] rounded-full flex items-center justify-center mx-auto shadow-[2px_2px_0px_#151515] mb-2">
            <CheckCircle2 className="w-7 h-7 text-[#10B981]" />
          </div>
          <span className="font-mono text-xs uppercase font-bold tracking-widest bg-[#065F46] px-2.5 py-0.5 rounded-[4px] border border-white/20">
            TRANSACTION SETTLED // ESCROW RELEASED
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl mt-2 tracking-tight">
            Payment Verified!
          </h1>
          <p className="font-sans text-xs text-white/90 mt-1">
            Thank you! Your payment has been securely cleared through Stripe.
          </p>
        </div>

        {/* Receipt Ticket Details */}
        <div className="p-6 space-y-4 font-mono text-xs">
          <div className="bg-[#FEF9EF] p-4 border-2 border-[#151515] rounded-[8px] space-y-3">
            <div className="flex justify-between items-center border-b border-[#151515]/20 pb-2">
              <span className="text-[#5B403A]">SERVICE:</span>
              <span className="font-bold text-[#151515] text-right font-heading text-sm">
                {payment.serviceTitle}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-[#151515]/20 pb-2">
              <span className="text-[#5B403A]">SPECIALIST:</span>
              <span className="font-bold text-[#151515]">
                {payment.technicianName}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-[#151515]/20 pb-2">
              <span className="text-[#5B403A]">SETTLED AT:</span>
              <span className="font-bold text-[#151515]">
                {formatDate(payment.paidAt)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-[#151515]/20 pb-2">
              <span className="text-[#5B403A]">TRANSACTION REF:</span>
              <span className="font-bold text-[#151515] text-[11px] truncate max-w-[200px]">
                {payment.transactionId}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
              <span className="font-bold text-[#151515]">TOTAL PAID:</span>
              <span className="font-black text-[#16A34A] text-lg sm:text-xl">
                {formatCurrency(payment.amount)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-sans text-xs text-[#5B403A] bg-[#DCFCE7] border border-[#16A34A] p-2.5 rounded-[6px]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>
              Your invoice is digitally stored and covered under FixMate 30-day workmanship guarantee.
            </span>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Link
              href={ROUTES.CUSTOMER.PAYMENTS}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-[#151515] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] rounded-[6px]"
            >
              <Receipt className="w-4 h-4 text-[#FF5B2E]" />
              <span>All Receipts</span>
            </Link>
            <Link
              href={ROUTES.CUSTOMER.BOOKINGS}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all rounded-[6px]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>My Bookings</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}