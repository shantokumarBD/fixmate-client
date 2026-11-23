import React from "react";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { getFeaturedServices } from "@/lib/api/services";
import { ROUTES } from "@/constants/routes";

export async function FeaturedServices() {
  const services = await getFeaturedServices(6);

  return (
    <section className="w-full bg-[#F5F0E6] py-16 lg:py-24 border-b-2 border-[#151515]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <div className="inline-block bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-3.5 py-1 rounded-[6px] font-mono text-xs font-bold text-[#151515] mb-3">
              [ DIAGNOSTIC &amp; REPAIR CATALOG ]
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-[#151515] tracking-tight">
              Featured Workshop Services
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#151515]/80 mt-2 font-medium max-w-xl">
              Choose from standard repair manifests handled by vetted workshop
              masters.
            </p>
          </div>

          <Link
            href={ROUTES.SERVICES}
            className="inline-flex items-center gap-2 bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] hover:shadow-[2px_2px_0px_#151515] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none font-mono text-xs font-bold px-4 py-2.5 rounded-[8px] text-[#151515] transition-all shrink-0 w-fit"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 text-[#151515]" />
          </Link>
        </div>

        {/* 6-Ticket Grid (3x2) or Resilient Fallback State */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="w-full bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-[10px] bg-[#FCD03D] border-2 border-[#151515] flex items-center justify-center shadow-[2px_2px_0px_#151515] mb-4">
              <Wrench className="w-7 h-7 text-[#151515]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#151515]">
              Catalog Temporarily Standby
            </h3>
            <p className="font-sans text-sm text-[#151515]/70 mt-1.5 max-w-md">
              Workshop services are currently synchronizing with the central
              dispatch hub. Please reload in a moment if services do not
              display.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
