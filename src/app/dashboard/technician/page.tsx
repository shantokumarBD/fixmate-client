import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { getMyTechnicianServices, getTechnicianBookings } from "@/lib/api/technician";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Wrench,
  DollarSign,
  Clock,
  CheckCircle2,
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
  // ১. টেকনিশিয়ান রোল গার্ড
  await requireRole("technician");

  // ২. রিয়েল-টাইম সার্ভিস ও বুকিং ফেচিং
  const [services, bookings] = await Promise.all([
    getMyTechnicianServices(),
    getTechnicianBookings(),
  ]);

  // ৩. মেট্রিক্স হিসাব
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

  // মোট আয় (Completed অথবা Paid বুকিং থেকে)
  const totalEarnings = bookings
    .filter((b) => b.status === "completed" || b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (Number(b.finalAmount) || Number(b.basePrice) || 0), 0);

  // ৪. সাম্প্রতিক ৫টি বুকিং রিকোয়েস্ট
  const recentBookings = bookings.slice(0, 5);

  // ৫. স্ট্যাটাস পাইপলাইন ডিস্ট্রিবিউশন
  const stages = [
    { label: "Requested", count: pendingRequests, color: "bg-[#2563EB]" },
    {
      label: "Accepted",
      count: bookings.filter((b) => b.status === "accepted").length,
      color: "bg-[#4F46E5]",
    },
    {
      label: "In Progress",
      count: bookings.filter((b) => ["in-progress", "in_progress"].includes(b.status)).length,
      color: "bg-[#F59E0B]",
    },
    { label: "Completed", count: completedJobs, color: "bg-[#10B981]" },
    {
      label: "Cancelled",
      count: bookings.filter((b) => ["cancelled", "rejected"].includes(b.status)).length,
      color: "bg-[#EF4444]",
    },
  ];

  const getPercentage = (count: number) => {
    if (totalBookings === 0) return 0;
    return Number(((count / totalBookings) * 100).toFixed(1));
  };

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
            Monitor active repair manifests, inbound hardware tickets, and service catalog approvals.
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

      {/* ================= SECTION 1: 4 STATS CARDS ================= */}
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

      {/* ================= SECTION 2: 2-COLUMN WORKBENCH GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Incoming Job Requests (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
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
                        <span className="flex items-center gap-1 font-mono text-[11px] truncate max-w-xs">
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
                        className="px-3 py-1.5 bg-white text-[#151515] hover:bg-[#FF5B2E] hover:text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] text-xs font-mono font-bold uppercase tracking-wider rounded-[4px] transition-all"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workshop Status & Pipeline Stages (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Workshop Availability Status (Challenge 1) */}
          <div className="bg-[#FEF9EF] border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs font-bold uppercase text-[#151515]">
                DISPATCH BAY STATUS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-bold border border-[#151515] bg-[#DCFCE7] text-[#16A34A]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 font-sans text-xs text-[#5B403A]">
              <p>
                You currently have <strong>{onlineServices} of {totalServices}</strong> services online and accepting bookings.
              </p>
              <div className="pt-2">
                <Link
                  href={ROUTES.TECHNICIAN.MY_SERVICES}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase hover:bg-[#F2EDE3] rounded-[6px]"
                >
                  <Power className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Toggle Availability</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Request Status Distribution */}
          <div className="bg-white border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515]">
            <h3 className="font-heading font-extrabold text-sm uppercase text-[#151515] mb-1">
              Work Order Pipeline
            </h3>
            <p className="font-sans text-xs text-[#5B403A] mb-4">
              Breakdown across {totalBookings} total logged repair jobs.
            </p>

            <div className="space-y-3">
              {stages.map((stage) => {
                const pct = getPercentage(stage.count);
                return (
                  <div key={stage.label} className="space-y-1">
                    <div className="flex justify-between font-mono text-xs font-bold text-[#151515]">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 ${stage.color} border border-[#151515]`}></span>
                        <span>{stage.label}</span>
                      </div>
                      <span>
                        {stage.count} ({pct}%)
                      </span>
                    </div>
                    {/* Neobrutalist Progress Bar */}
                    <div className="w-full h-2.5 bg-[#FEF9EF] border-2 border-[#151515] rounded-[3px] overflow-hidden p-0.5 flex">
                      <div
                        className={`h-full ${stage.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Quick Navigation Launchpad */}
          <div className="bg-[#151515] text-[#F5F0E6] border-2 border-[#151515] rounded-[10px] p-4 shadow-[4px_4px_0px_#FF5B2E]">
            <span className="font-mono text-[11px] font-bold uppercase text-[#FCD03D] block mb-2">
              QUICK LAUNCHPAD
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={ROUTES.TECHNICIAN.MY_SERVICES}
                className="p-2 bg-[#242424] hover:bg-[#303030] border border-neutral-700 rounded-[6px] text-xs font-sans text-center transition-colors block"
              >
                My Catalog
              </Link>
              <Link
                href={ROUTES.TECHNICIAN.REQUESTS}
                className="p-2 bg-[#242424] hover:bg-[#303030] border border-neutral-700 rounded-[6px] text-xs font-sans text-center transition-colors block"
              >
                Job Pipeline
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}