import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { getMyBookings } from "@/lib/api/bookings";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaymentBadge } from "@/components/shared/PaymentBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ClipboardList,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ListFilter,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Overview | FixMate",
};

export default async function CustomerOverviewPage() {
  // কাস্টমার রোল গার্ড
  await requireRole("customer");
  const bookings = await getMyBookings();

  // 1. Metric Calculations
  const totalRequests = bookings.length;
  const activeJobs = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status?.toLowerCase())
  ).length;
  const completedJobs = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed"
  ).length;

  // 2. Stage Breakdown for Status Distribution Chart
  const statusCounts = {
    requested: bookings.filter((b) => b.status?.toLowerCase() === "requested").length,
    accepted: bookings.filter((b) => b.status?.toLowerCase() === "accepted").length,
    "in-progress": bookings.filter((b) => b.status?.toLowerCase() === "in-progress").length,
    completed: bookings.filter((b) => b.status?.toLowerCase() === "completed").length,
    rejected: bookings.filter((b) => b.status?.toLowerCase() === "rejected").length,
    cancelled: bookings.filter((b) => b.status?.toLowerCase() === "cancelled").length,
  };

  const getPercentage = (count: number) => {
    if (totalRequests === 0) return 0;
    return Number(((count / totalRequests) * 100).toFixed(1));
  };

  const distributionStages = [
    { label: "Requested", count: statusCounts.requested, color: "bg-[#2563EB]" },
    { label: "Accepted", count: statusCounts.accepted, color: "bg-[#4F46E5]" },
    { label: "In Progress", count: statusCounts["in-progress"], color: "bg-[#F59E0B]" },
    { label: "Completed", count: statusCounts.completed, color: "bg-[#10B981]" },
    { label: "Rejected", count: statusCounts.rejected, color: "bg-[#EF4444]" },
    { label: "Cancelled", count: statusCounts.cancelled, color: "bg-[#6B7280]" },
  ];

  // 3. Latest 5 Bookings for Quick Snapshot
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8 pb-10">
      {/* Station Header */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              STATION ACTIVE
            </span>
            <span className="font-mono text-xs text-[#5B403A]">
              SYS_STATUS: READY // {new Date().toISOString().split("T")[0]}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            Customer Workbench Overview
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Monitor your active hardware work orders, inspect technician manifests, and track diagnostics.
          </p>
        </div>

        <Link
          href={ROUTES.SERVICES}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-[6px] shrink-0"
        >
          <Wrench className="w-4 h-4" />
          <span>Book New Repair</span>
        </Link>
      </div>

      {/* SECTION 1: METRICS & STATUS DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 3 Metric Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          <StatsCard
            title="Total Requests"
            value={totalRequests}
            subtitle="Lifetime hardware orders"
            icon={<ClipboardList className="w-5 h-5 text-[#151515]" />}
          />
          <StatsCard
            title="Active Jobs"
            value={activeJobs}
            subtitle="In diagnostic & repair bay"
            accentColor="text-[#FF5B2E]"
            icon={<Wrench className="w-5 h-5 text-[#FF5B2E]" />}
          />
          <StatsCard
            title="Completed Jobs"
            value={completedJobs}
            subtitle="Passed bench inspection QA"
            icon={<CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
          />
        </div>

        {/* Right Column: Status Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white border-2 border-[#151515] rounded-[10px] p-5 sm:p-6 shadow-[4px_4px_0px_#151515] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b-2 border-[#151515]">
              <span className="w-3 h-3 bg-[#FF5B2E] border-2 border-[#151515]"></span>
              <h2 className="font-heading font-bold text-lg text-[#151515]">
                Bookings Status Distribution
              </h2>
            </div>
            <p className="font-sans text-xs text-[#5B403A] mt-2">
              Real-time stage metrics across all logged repair tickets. Calibrated against workshop SLA.
            </p>

            <div className="mt-5 space-y-3">
              {distributionStages.map((stage) => {
                const pct = getPercentage(stage.count);
                return (
                  <div key={stage.label} className="space-y-1">
                    <div className="flex justify-between font-mono text-xs font-bold text-[#151515]">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 ${stage.color} border border-[#151515]`}></span>
                        <span>{stage.label}</span>
                      </div>
                      <span>
                        {stage.count} {stage.count === 1 ? "unit" : "units"} ({pct}%)
                      </span>
                    </div>
                    {/* Flat Neobrutalist Progress Bar */}
                    <div className="w-full h-3 bg-[#FEF9EF] border-2 border-[#151515] rounded-[4px] overflow-hidden p-0.5 flex">
                      <div
                        className={`h-full ${stage.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: RECENT BOOKINGS TABLE */}
      <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#FEF9EF] border-2 border-[#151515] flex items-center justify-center">
              <ListFilter className="w-4 h-4 text-[#151515]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-[#151515]">
                Recent Bookings Manifest
              </h2>
              <p className="font-sans text-xs text-[#5B403A]">
                Latest hardware repair queue manifests and active technician work orders.
              </p>
            </div>
          </div>

          <Link
            href={ROUTES.CUSTOMER.BOOKINGS}
            className="px-3 py-1.5 bg-[#FEF9EF] hover:bg-[#FCD03D] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold text-[#151515] inline-flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table Content or Empty State */}
        {recentBookings.length === 0 ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-[#FEF9EF]/40">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <Wrench className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              No Repair Orders Logged Yet
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-md mt-1 mb-4">
              You haven&apos;t booked any hardware diagnostic services. Browse our catalog of certified specialists to submit your first service ticket.
            </p>
            <Link
              href={ROUTES.SERVICES}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform rounded-[6px]"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase">
                  <th className="py-3 px-4 font-bold tracking-wider">Ticket & Service</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Technician</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Schedule</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Quote / Escrow</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Status</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#151515] font-sans text-xs sm:text-sm">
                {recentBookings.map((b) => {
                  const ticketCode = `#FX-${b._id?.slice(-4).toUpperCase()}`;
                  return (
                    <tr key={b._id} className="hover:bg-[#FEF9EF]/50 transition-colors">
                      {/* Ticket & Service Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-heading font-bold text-[#151515] leading-tight">
                            {b.serviceTitle}
                          </span>
                          <span className="font-mono text-[11px] text-[#FF5B2E] font-bold mt-0.5">
                            {ticketCode}
                          </span>
                        </div>
                      </td>

                      {/* Technician */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-[#151515]">
                          <span>{b.technicianName || "Assigned Specialist"}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                        </div>
                        <span className="font-mono text-[10px] text-[#5B403A]">{b.technicianEmail}</span>
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

                      {/* Booking Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={b.status} />
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PaymentBadge status={b.paymentStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}