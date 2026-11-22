import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import {
  getMyTechnicianServices,
  getTechnicianBookings,
} from "@/lib/api/technician";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TechnicianStatusChart } from "@/components/dashboard/TechnicianStatusChart";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Wrench,
  DollarSign,
  Clock,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  ClipboardList,
  Power,
  Inbox,
  Calendar,
  MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Technician Workbench Overview | FixMate",
};

export default async function TechnicianOverviewPage() {
  await requireRole("technician");

  const [services, bookings] = await Promise.all([
    getMyTechnicianServices(),
    getTechnicianBookings(),
  ]);

  const totalServices = services.length;
  const approvedServices = services.filter((s) => s.approvalStatus === "approved").length;
  const pendingServices = services.filter((s) => s.approvalStatus === "pending").length;
  const onlineServices = services.filter((s) => s.isAvailable).length;

  const totalBookings = bookings.length;
  const pendingRequests = bookings.filter((b) => b.status === "requested").length;
  const activeJobs = bookings.filter((b) =>
    ["accepted", "in-progress", "in_progress"].includes(b.status)
  ).length;
  const completedJobs = bookings.filter((b) => b.status === "completed").length;

  const totalEarnings = bookings
    .filter((b) => b.status === "completed" || b.paymentStatus === "paid")
    .reduce(
      (sum, b) => sum + (Number(b.finalAmount) || Number(b.basePrice) || 0),
      0
    );

  const recentBookings = bookings.slice(0, 5);

  const stages = [
    { label: "Requested", count: pendingRequests, color: "bg-[#2563EB]" },
    {
      label: "Accepted",
      count: bookings.filter((b) => b.status === "accepted").length,
      color: "bg-[#4F46E5]",
    },
    {
      label: "In Progress",
      count: bookings.filter((b) =>
        ["in-progress", "in_progress"].includes(b.status)
      ).length,
      color: "bg-[#F59E0B]",
    },
    { label: "Completed", count: completedJobs, color: "bg-[#10B981]" },
    {
      label: "Cancelled",
      count: bookings.filter((b) =>
        ["cancelled", "rejected"].includes(b.status)
      ).length,
      color: "bg-[#EF4444]",
    },
  ];



  return (
    <div className="space-y-8 pb-16 w-full">
      {/* ================= STATION HEADER ================= */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              STATION 01 // OVERVIEW
            </span>
            <span className="font-mono text-xs text-[#5B403A]">
              DISPATCH ACTIVE // {new Date().toISOString().split("T")[0]}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            Technician Workbench Overview
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Monitor active repair manifests, inbound hardware tickets, and
            service catalog approvals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={ROUTES.TECHNICIAN.ADD_SERVICE}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-[6px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Service</span>
          </Link>
          <Link
            href={ROUTES.TECHNICIAN.REQUESTS}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] rounded-[6px]"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Job Pipeline</span>
          </Link>
        </div>
      </div>

      {/* ================= TIER 1: 4 STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Settled Earnings"
          value={formatCurrency(totalEarnings)}
          subtitle="From completed repair jobs"
          accentColor="text-[#16A34A]"
          icon={<DollarSign className="w-5 h-5 text-[#16A34A]" />}
        />
        <StatsCard
          title="Active Work Orders"
          value={activeJobs}
          subtitle="In diagnosis & repair bay"
          accentColor="text-[#FF5B2E]"
          icon={<Wrench className="w-5 h-5 text-[#FF5B2E]" />}
        />
        <StatsCard
          title="Pending Inbound"
          value={pendingRequests}
          subtitle="Awaiting your acceptance"
          accentColor="text-[#2563EB]"
          icon={<Clock className="w-5 h-5 text-[#2563EB]" />}
        />
        <StatsCard
          title="Workshop Services"
          value={totalServices}
          subtitle={`${approvedServices} Approved • ${pendingServices} Pending`}
          icon={<ShieldCheck className="w-5 h-5 text-[#151515]" />}
        />
      </div>

      {/* ================= TIER 2: PIPELINE ANALYTICS & WORKSHOP READINESS (7:5 SPLIT) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Recharts Pipeline Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#FF5B2E] border border-[#151515]"></span>
                <h3 className="font-heading font-extrabold text-sm uppercase text-[#151515]">
                  Work Order Pipeline
                </h3>
              </div>
              <span className="font-mono text-xs font-bold bg-[#FEF9EF] border border-[#151515] px-2 py-0.5 rounded">
                TOTAL: {totalBookings} JOBS
              </span>
            </div>
            <p className="font-sans text-xs text-[#5B403A] mt-2 mb-2">
              Breakdown across your assigned hardware repair workflow stages.
            </p>

            {/* Recharts Bar Chart */}
            <TechnicianStatusChart stages={stages} totalBookings={totalBookings} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t-2 border-[#151515] mt-3">
            {stages.map((stage) => (
              <div
                key={stage.label}
                className="bg-[#FEF9EF] border border-[#151515] p-2 rounded text-center"
              >
                <span className="font-mono text-[10px] uppercase font-bold text-[#5B403A] block">
                  {stage.label}
                </span>
                <span className="font-mono font-extrabold text-sm text-[#151515]">
                  {stage.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dispatch Status & Fast Controls (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* Card 1: Availability Status */}
          <div className="bg-[#FEF9EF] border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515] flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-[#151515]">
                <span className="font-mono text-xs font-bold uppercase text-[#151515]">
                  DISPATCH BAY STATUS
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-bold border border-[#151515] bg-[#DCFCE7] text-[#16A34A]">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  ONLINE
                </span>
              </div>

              <div className="py-3 font-sans text-xs text-[#5B403A] space-y-1">
                <p>
                  You currently have <strong>{onlineServices} of {totalServices}</strong> catalog services online and active for customer bookings.
                </p>
                <p className="text-[11px] text-[#5B403A]/80">
                  Toggle services offline when your repair bays are at full capacity.
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.TECHNICIAN.MY_SERVICES}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase hover:bg-[#FCD03D]/20 transition-all rounded-[6px]"
            >
              <Power className="w-4 h-4 text-[#16A34A]" />
              <span>Toggle Service Online Status</span>
            </Link>
          </div>

          {/* Card 2: Quick Launchpad */}
          <div className="bg-[#151515] text-[#F5F0E6] border-2 border-[#151515] rounded-[10px] p-4 shadow-[4px_4px_0px_#FF5B2E]">
            <span className="font-mono text-[11px] font-bold uppercase text-[#FCD03D] block mb-2">
              DISPATCH QUICK LAUNCHPAD
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={ROUTES.TECHNICIAN.MY_SERVICES}
                className="p-2.5 bg-[#242424] hover:bg-[#303030] border border-neutral-700 rounded-[6px] text-xs font-sans text-center transition-colors block text-white font-bold"
              >
                My Catalog
              </Link>
              <Link
                href={ROUTES.TECHNICIAN.REQUESTS}
                className="p-2.5 bg-[#242424] hover:bg-[#303030] border border-neutral-700 rounded-[6px] text-xs font-sans text-center transition-colors block text-white font-bold"
              >
                Job Pipeline
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TIER 3: RECENT INCOMING JOB REQUESTS ================= */}
      <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#151515] bg-[#FEF9EF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF5B2E] border-2 border-[#151515]"></span>
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#151515]">
              Recent Inbound Job Requests
            </h2>
          </div>
          <Link
            href={ROUTES.TECHNICIAN.REQUESTS}
            className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#FF5B2E] hover:underline"
          >
            <span>View Full Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* List or Empty State */}
        {recentBookings.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <Inbox className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-[#151515]">
              No Inbound Repair Requests Yet
            </h3>
            <p className="font-sans text-xs text-[#5B403A] max-w-sm mt-1 mb-4">
              Make sure your listed services are set to <strong>Online</strong> so customers can book repairs in your service area.
            </p>
            <Link
              href={ROUTES.TECHNICIAN.MY_SERVICES}
              className="px-3.5 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FEF9EF] rounded-[6px]"
            >
              Manage My Services
            </Link>
          </div>
        ) : (
          <div className="divide-y-2 divide-[#151515]">
            {recentBookings.map((b) => (
              <div
                key={b._id}
                className="p-4 sm:p-5 hover:bg-[#FEF9EF]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold bg-[#FEF9EF] border border-[#151515] px-1.5 py-0.2 rounded text-[#FF5B2E]">
                      #{b._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="font-heading font-bold text-sm text-[#151515] truncate">
                      {b.serviceTitle}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5B403A]">
                    <span className="font-semibold text-[#151515]">
                      Customer: {b.customerName}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#5B403A]" />
                      {formatDate(b.preferredDate)} {b.timeSlot && `(${b.timeSlot})`}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-[#5B403A] shrink-0" />
                      {b.address}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className="font-mono font-black text-sm text-[#151515]">
                    {formatCurrency(b.finalAmount || b.basePrice || 0)}
                  </span>
                  <Link
                    href={ROUTES.TECHNICIAN.REQUESTS}
                    className="px-3.5 py-1.5 bg-white text-[#151515] hover:bg-[#FF5B2E] hover:text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-xs font-mono font-bold uppercase tracking-wider rounded-[4px] transition-all"
                  >
                    Review Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}