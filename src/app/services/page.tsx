import { Suspense } from "react";
import Link from "next/link";
import { Wrench, RotateCcw, X } from "lucide-react";
import { fetchFilteredServices, getCategoryCounts } from "@/lib/api/services";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { ServiceSidebar } from "@/components/services/ServiceSidebar";
import { ROUTES } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Verified Repair Services | FixMate",
  description:
    "Browse certified workshop job manifests. Upfront flat-rate pricing, 90-day warranty, and pay-after-service model.",
};

interface ServicesPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    serviceMode?: string;
    sort?: string;
  }>;
}

// 1. Loading Skeleton for Neobrutalist UI
function ServicesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start animate-pulse">
      <div className="h-96 bg-white/60 border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-5">
        <div className="h-5 bg-[#151515]/20 rounded mb-4 w-1/2" />
        <div className="h-10 bg-[#151515]/10 rounded mb-6" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 bg-[#151515]/10 rounded" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-80 bg-white/60 border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515]"
          />
        ))}
      </div>
    </div>
  );
}

// 2. Dynamic Content Component (Streamed via Suspense)
async function ServicesContent({ searchParams }: ServicesPageProps) {
  const filters = await searchParams;
  const [services, categoryCounts] = await Promise.all([
    fetchFilteredServices(filters),
    getCategoryCounts(),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      
      {/* Left Column: 100% Fixed Sticky Sidebar */}
      <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start z-20">
        <ServiceSidebar currentFilters={filters} categoryCounts={categoryCounts} />
      </aside>

      {/* Right Column: Active Badges + Cards Grid */}
      <section className="lg:col-span-3 space-y-4">
        {/* Results Counter & Active Filter Tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-2 border-[#151515] rounded-[8px] shadow-[2px_2px_0px_#151515]">
          <div className="font-mono text-xs font-bold text-[#151515]">
            {services.length} {services.length === 1 ? "SERVICE" : "SERVICES"} AVAILABLE
          </div>

          {(filters.category || filters.serviceMode || filters.search) && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.category && (
                <span className="inline-flex items-center gap-1 bg-[#FCD03D] border border-[#151515] px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-bold">
                  {filters.category}
                </span>
              )}
              {filters.serviceMode && (
                <span className="inline-flex items-center gap-1 bg-[#FF5B2E] border border-[#151515] px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-bold">
                  {filters.serviceMode}
                </span>
              )}
              {filters.search && (
                <span className="inline-flex items-center gap-1 bg-[#DEDAD0] border border-[#151515] px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-bold">
                  &quot;{filters.search}&quot;
                </span>
              )}
              <Link
                href={ROUTES.SERVICES}
                scroll={false}
                className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#FF5B2E] hover:underline ml-1"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </Link>
            </div>
          )}
        </div>

        {/* Services Grid or Empty State */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="w-full bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-[8px] bg-[#FCD03D] border-2 border-[#151515] flex items-center justify-center shadow-[2px_2px_0px_#151515] mb-3">
              <Wrench className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#151515]">
              No Services Found
            </h3>
            <p className="font-sans text-xs text-[#151515]/70 mt-1 max-w-sm">
              We couldn&apos;t find any repair services matching your selected filters.
            </p>
            <Link
              href={ROUTES.SERVICES}
              scroll={false}
              className="mt-4 inline-flex items-center gap-1.5 bg-[#FF5B2E] text-[#151515] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] hover:shadow-[1px_1px_0px_#151515] font-mono text-xs font-bold px-3.5 py-2 rounded-[6px] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

// 3. Main Static Page Shell (Aligned with Navbar max-w-[1200px])
export default function ServicesPage({ searchParams }: ServicesPageProps) {
  return (
    <main className="w-full min-h-screen bg-[#F5F0E6] py-6 text-[#151515]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        
        {/* Compact Clean Header - Aligned with Navbar */}
        <div className="mb-6 pb-4 border-b-2 border-[#151515]">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight flex flex-wrap items-center">
            <span>Explore All</span>
            <span className="inline-block mx-2 bg-[#FCD03D] px-2.5 py-0.5 border-2 border-[#151515] rounded-[4px] shadow-[2px_2px_0px_#151515]">
              Verified
            </span>
            <span>Services</span>
          </h1>
          <p className="mt-2 font-sans text-xs sm:text-sm text-[#151515]/75 font-medium">
            Transparent upfront quotes • 90-day parts warranty • Pay only after inspection
          </p>
        </div>

        {/* Dynamic Data wrapped in Suspense */}
        <Suspense fallback={<ServicesLoadingSkeleton />}>
          <ServicesContent searchParams={searchParams} />
        </Suspense>

      </div>
    </main>
  );
}