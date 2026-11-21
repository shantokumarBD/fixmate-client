// File: src/app/dashboard/customer/bookings/page.tsx
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { getMyBookings } from "@/lib/api/bookings";
import { BookingsTable } from "@/components/dashboard/BookingsTable";
import { Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Bookings | FixMate",
};

export default async function MyBookingsPage() {
  // Role Guard: Customer only
  await requireRole("customer");

  // Fetch real-time customer bookings from Express backend
  const bookings = await getMyBookings();

  return (
    <div className="space-y-6 pb-10">
      {/* Station Header */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#DBEAFE] text-[#1E40AF] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              STATION 02 // MY BOOKINGS
            </span>
            <span className="font-mono text-xs text-[#5B403A]">
              DISPATCH QUEUE: SYNCHRONIZED
            </span>
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-[6px] shrink-0"
        >
          <Wrench className="w-4 h-4" />
          <span>New Repair</span>
        </Link>
      </div>

      {/* Interactive Bookings Table & Cancel Action */}
      <BookingsTable bookings={bookings} />
    </div>
  );
}