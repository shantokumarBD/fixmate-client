import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { CreditCard, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Payment History | FixMate",
};

export default function CustomerPaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b-2 border-[#151515]">
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

      {/* Module Info */}
      <div className="p-8 bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#FEF9EF] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-[#151515]" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#151515]">
              Customer Settlement Terminal
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] mt-1 mb-4">
                coming soon ...........
            </p>
            <Link
              href={ROUTES.CUSTOMER.OVERVIEW}
              className="font-mono text-xs font-bold text-[#FF5B2E] inline-flex items-center gap-1 hover:underline"
            >
              Back to Overview <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}