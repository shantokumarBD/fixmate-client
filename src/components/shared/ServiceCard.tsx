import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const ticketCode = service._id ? `#FX-${service._id.slice(-4).toUpperCase()}` : "#FX-900";

  return (
    <article className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform group">
      <div>
        {/* Ticket Header Manifest Strip */}
        <div className="bg-[#F5F0E6] border-b-2 border-[#151515] px-3.5 py-2 flex items-center justify-between font-mono text-xs">
          <span className="font-black text-[#151515] shrink-0 text-xs tracking-wide">{ticketCode}</span>
          <span className="bg-[#FCD03D] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] font-bold text-[10px] uppercase text-[#151515] whitespace-nowrap shadow-[1px_1px_0px_#151515]">
            {service.serviceMode}
          </span>
        </div>

        {/* Service Image with Floating Category Tag */}
        <div className="h-44 bg-[#DEDAD0] border-b-2 border-[#151515] relative overflow-hidden">
          <Image
            src={service.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Floating Category Stamp */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-white/95 backdrop-blur-sm border-2 border-[#151515] px-2.5 py-0.5 rounded-[4px] font-mono font-bold text-[10px] uppercase text-[#151515] shadow-[2px_2px_0px_#151515]">
              {service.category}
            </span>
          </div>
        </div>

        {/* Title, Technician & Estimated Duration */}
        <div className="p-4 sm:p-5">
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#151515] leading-snug line-clamp-1 group-hover:text-[#FF5B2E] transition-colors">
            {service.title}
          </h3>
          <p className="font-sans text-xs text-[#151515]/75 mt-1 font-medium">
            Technician: <span className="font-semibold text-[#151515]">{service.technicianName || "Certified Master"}</span>
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="font-mono text-[11px] text-[#151515]/70 flex items-center gap-1">
              <span>⏱️</span>
              <span className="font-bold text-[#151515]">{service.estimatedDuration || "1 - 2 Hours"}</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#151515] bg-[#FEF9EF] border border-[#151515] px-1.5 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
              <Star className="w-3 h-3 fill-[#FCD03D] text-[#151515]" />
              <span>
                {service.averageRating && service.averageRating > 0
                  ? `${service.averageRating.toFixed(1)} (${service.reviewCount || 0})`
                  : "New"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Perforated Ticket Section */}
      <div>
        {/* Ticket Perforated Tear Notch Line */}
        <div className="border-b-2 border-dashed border-[#151515] my-1 relative">
          <span className="absolute -left-3 -top-2 w-4 h-4 bg-[#F5F0E6] border-r-2 border-[#151515] rounded-r-full" />
          <span className="absolute -right-3 -top-2 w-4 h-4 bg-[#F5F0E6] border-l-2 border-[#151515] rounded-l-full" />
        </div>

        <div className="p-4 sm:p-5 pt-2 sm:pt-3 flex items-center justify-between bg-white">
          <div>
            <span className="font-mono text-[9px] block text-[#151515]/70 uppercase font-bold">
              Starting Price
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-[#151515]">
              From ${service.basePrice}
            </span>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 bg-[#FF5B2E] text-[#151515] border-2 border-[#151515] shadow-[3px_3px_0px_#151515] hover:shadow-[1px_1px_0px_#151515] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none font-heading text-xs font-bold px-3.5 py-2 rounded-[6px] transition-all whitespace-nowrap cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#151515]" />
          </Link>
        </div>
      </div>
    </article>
  );
}