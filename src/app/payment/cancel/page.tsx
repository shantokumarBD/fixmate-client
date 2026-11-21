// File: src/app/payment/cancel/page.tsx
import Link from "next/link";
import { AlertCircle, ArrowLeft, CalendarCheck } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Payment Cancelled | FixMate",
};

export default function PaymentCancelPage() {
  return (
    <main className="min-h-[80vh] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border-2 border-[#151515] shadow-[8px_8px_0px_#151515] rounded-[12px] overflow-hidden text-center p-6 sm:p-8 space-y-4">
        
        <div className="w-14 h-14 bg-[#FEF3C7] border-2 border-[#151515] rounded-full flex items-center justify-center mx-auto shadow-[2px_2px_0px_#151515]">
          <AlertCircle className="w-7 h-7 text-[#D97706]" />
        </div>

        <span className="font-mono text-xs uppercase font-bold tracking-widest bg-[#FEF3C7] text-[#92400E] border border-[#151515] px-2.5 py-0.5 rounded-[4px] inline-block">
          PAYMENT PENDING // NO CHARGES
        </span>

        <h1 className="font-heading font-black text-2xl text-[#151515]">
          Payment Not Completed
        </h1>

        <p className="font-sans text-xs sm:text-sm text-[#5B403A] leading-relaxed">
          The Stripe checkout session was cancelled. No charges were made to your account. You can complete this payment whenever you are ready from your bookings list.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href={ROUTES.CUSTOMER.BOOKINGS}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] font-heading font-bold text-xs uppercase tracking-wider rounded-[6px]"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Back to Bookings</span>
          </Link>
          <Link
            href={ROUTES.HOME}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#151515] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] rounded-[6px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}