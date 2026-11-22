import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { requireRole } from "@/lib/auth/session";
import { getAdminStats, getAllBookingsForAdmin } from "@/lib/api/admin";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaymentBadge } from "@/components/shared/PaymentBadge";
import { AdminOverviewCharts } from "@/components/dashboard/AdminOverviewCharts";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  DollarSign,
  Wrench,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  Inbox,
  Calendar,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Control Console | FixMate",
};

export default async function AdminOverviewPage() {
  await requireRole("admin");

  const [stats, bookings] = await Promise.all([
    getAdminStats(),
    getAllBookingsForAdmin(),
  ]);

  const recentBookings = bookings.slice(0, 5);

  const customerCount = Math.max(0, stats.totalUsers - stats.totalTechnicians);

  return (
    <div className="space-y-8 pb-16 w-full">
      {/* ================= STATION HEADER ================= */}
      <div className="pb-4 border-b-2 border-[#151515] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              ROOT CONSOLE // SYSTEM OVERVIEW
            </span>
            <span className="font-mono text-xs text-[#5B403A]">
              TELEMETRY: LIVE // {new Date().toISOString().split("T")[0]}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
            Admin Control Console
          </h1>
          <p className="font-sans text-sm text-[#5B403A] mt-1">
            Monitor gross platform revenue, user ecosystem, active repair
            tickets, and catalog moderation.
          </p>
        </div>

        {/* Quick Console Jump Links */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Link
            href={ROUTES.ADMIN.SERVICES}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF9EF] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono font-bold text-xs uppercase hover:bg-white rounded-[6px]"
          >
            <span>Moderation</span>
            {stats.pendingServices > 0 && (
              <span className="bg-[#FF5B2E] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {stats.pendingServices}
              </span>
            )}
          </Link>
          <Link
            href={ROUTES.ADMIN.USERS}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-mono font-bold text-xs uppercase hover:bg-[#FEF9EF] rounded-[6px]"
          >
            <span>Users</span>
          </Link>
        </div>
      </div>

      {/* ================= MODERATION ALERT BANNER ================= */}
      {stats.pendingServices > 0 && (
        <div className="bg-[#FEF9EF] border-2 border-[#151515] shadow-[4px_4px_0px_#FF5B2E] rounded-[10px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[6px] bg-[#FF5B2E] border-2 border-[#151515] flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_#151515]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-[#FF5B2E] uppercase tracking-wider block">
                ACTION REQUIRED // MODERATION QUEUE
              </span>
              <p className="font-heading font-bold text-sm text-[#151515]">
                {stats.pendingServices}{" "}
                {stats.pendingServices === 1
                  ? "repair service is"
                  : "repair services are"}{" "}
                pending administrator review.
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.ADMIN.SERVICES}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all shrink-0"
          >
            <span>Review Queue</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ================= TIER 1: 4 PLATFORM METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Gross Platform GMV"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Settled customer repair revenue"
          accentColor="text-[#16A34A]"
          icon={<DollarSign className="w-5 h-5 text-[#16A34A]" />}
        />
        <StatsCard
          title="Registered Users"
          value={stats.totalUsers}
          subtitle={`${stats.totalTechnicians} Techs • ${customerCount} Customers`}
          accentColor="text-[#2563EB]"
          icon={<Users className="w-5 h-5 text-[#2563EB]" />}
        />
        <StatsCard
          title="Hardware Orders"
          value={stats.totalBookings}
          subtitle="Total platform service tickets"
          accentColor="text-[#FF5B2E]"
          icon={<Wrench className="w-5 h-5 text-[#FF5B2E]" />}
        />
        <StatsCard
          title="Catalog Services"
          value={stats.totalServices}
          subtitle={`${stats.pendingServices} Pending Moderation`}
          icon={<ShieldAlert className="w-5 h-5 text-[#151515]" />}
        />
      </div>

      {/* ================= TIER 2: VISUAL ANALYTICS ROW (7:5 SPLIT) ================= */}
      <div>
        <AdminOverviewCharts
          techCount={stats.totalTechnicians}
          customerCount={customerCount}
          recentBookings={bookings.slice(0, 6)}
        />
      </div>

      {/* ================= TIER 3: WORKBENCH OPERATIONS (8:4 SPLIT) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Platform Orders (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] overflow-hidden">
            <div className="p-4 sm:p-5 border-b-2 border-[#151515] bg-[#FEF9EF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#151515] border border-[#151515]"></span>
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#151515]">
                  Global Work Order Stream
                </h2>
              </div>
              <Link
                href={ROUTES.ADMIN.BOOKINGS}
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#FF5B2E] hover:underline"
              >
                <span>View All Manifests</span>
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
                  No Platform Orders Yet
                </h3>
                <p className="font-sans text-xs text-[#5B403A] max-w-sm mt-1">
                  When customers book repair appointments with technicians,
                  tickets will stream into this audit console.
                </p>
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
                        <PaymentBadge status={b.paymentStatus} />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5B403A]">
                        <span>
                          Customer: <strong>{b.customerName}</strong>
                        </span>
                        <span>
                          Tech: <strong>{b.technicianName}</strong>
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#5B403A]" />
                          {formatDate(b.preferredDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="font-mono font-black text-sm text-[#151515]">
                        {formatCurrency(b.finalAmount || b.basePrice || 0)}
                      </span>
                      <Link
                        href={ROUTES.ADMIN.BOOKINGS}
                        className="p-1.5 hover:bg-[#FEF9EF] border border-neutral-300 hover:border-[#151515] rounded transition-all"
                        title="Audit Booking"
                      >
                        <ChevronRight className="w-4 h-4 text-[#151515]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Operations Control & Security (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Interactive Admin Console Launchpad */}
          <div className="bg-white border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515]">
            <h3 className="font-heading font-extrabold text-sm uppercase text-[#151515] mb-3">
              Operations Control
            </h3>
            <div className="space-y-2">
              <Link
                href={ROUTES.ADMIN.SERVICES}
                className="flex items-center justify-between p-2.5 bg-[#FEF9EF] hover:bg-[#FCD03D]/30 border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF5B2E]" />
                  <span className="font-heading font-bold text-xs text-[#151515]">
                    Service Moderation
                  </span>
                </div>
                {stats.pendingServices > 0 && (
                  <span className="bg-[#FF5B2E] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    {stats.pendingServices} PENDING
                  </span>
                )}
              </Link>

              <Link
                href={ROUTES.ADMIN.USERS}
                className="flex items-center justify-between p-2.5 bg-white hover:bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-heading font-bold text-xs text-[#151515]">
                    Manage Users & Roles
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5B403A]" />
              </Link>

              <Link
                href={ROUTES.ADMIN.BOOKINGS}
                className="flex items-center justify-between p-2.5 bg-white hover:bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-[#151515]" />
                  <span className="font-heading font-bold text-xs text-[#151515]">
                    All Platform Orders
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5B403A]" />
              </Link>

              <Link
                href={ROUTES.ADMIN.TRANSACTIONS}
                className="flex items-center justify-between p-2.5 bg-white hover:bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#16A34A]" />
                  <span className="font-heading font-bold text-xs text-[#151515]">
                    Financial Audits
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5B403A]" />
              </Link>
            </div>
          </div>

          {/* Card 2: Security & Governance Compliance */}
          <div className="bg-[#151515] text-[#F5F0E6] border-2 border-[#151515] rounded-[10px] p-4 shadow-[4px_4px_0px_#FF5B2E]">
            <span className="font-mono text-[11px] font-bold uppercase text-[#FCD03D] block mb-1">
              GOVERNANCE & SECURITY
            </span>
            <p className="font-sans text-xs text-[#DEDAD0] leading-relaxed">
              Role modifications and service rejection actions are logged with
              operator session stamps for platform audit compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}