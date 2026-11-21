import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { CalendarCheck, Wrench, ArrowRight } from "lucide-react";

export const metadata = {
  title: "My Bookings | FixMate",
};

export default function MyBookingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#DBEAFE] text-[#1E40AF] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              STATION 02 // BOOKINGS
            </span>
            <span className="font-mono text-xs text-[#5B403A]">QUEUE: SYNCHRONIZED</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            My Repair Bookings
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Track hardware work order pipeline transitions, technician notes, and cancellation rights.
          </p>
        </div>

        <Link
          href={ROUTES.SERVICES}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all rounded-[6px] shrink-0"
        >
          <Wrench className="w-4 h-4" />
          <span>New Repair</span>
        </Link>
      </div>

      {/* Workshop Module Card */}
      <div className="p-8 bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#DBEAFE] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6 text-[#1E40AF]" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#151515]">
              Active Bookings Management Queue
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] mt-1 mb-4">
              coming soon....
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