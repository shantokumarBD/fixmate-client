import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Wrench,
  Award,
} from "lucide-react";
import { getServiceById } from "@/lib/api/services";
import { BookServiceButton } from "@/components/services/BookServiceButton";
import { ROUTES } from "@/constants/routes";

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  const ticketCode = service._id ? `#FX-${service._id.slice(-4).toUpperCase()}` : "#FX-900";
  const technicianName = service.technician?.name || service.technicianName || "Certified Master";
  const technicianArea = service.technician?.area || service.serviceArea || "Dhaka Metropolitan Area";
  const technicianBio = service.technician?.bio || "Certified electronics and appliance repair specialist with OEM diagnostic expertise.";
  const technicianPhone = service.technician?.phone || "+880 1700-000000";

  return (
    <main className="w-full min-h-screen bg-[#F5F0E6] py-6 sm:py-8 text-[#151515]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        
        {/* 1. Breadcrumbs & Back Link */}
        <div className="mb-5 flex items-center justify-between flex-wrap gap-2">
          <nav className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#151515]/70">
            <Link href={ROUTES.HOME} className="hover:text-[#151515] hover:underline">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={ROUTES.SERVICES} className="hover:text-[#151515] hover:underline">
              Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#151515] font-bold truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </nav>

          <Link
            href={ROUTES.SERVICES}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold bg-white border-2 border-[#151515] px-3 py-1 rounded-[6px] shadow-[2px_2px_0px_#151515] hover:bg-[#FEF9EF] transition-all"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* 2. Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Service Manifest & Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-mono text-xs font-black bg-[#151515] text-[#FEF9EF] px-2.5 py-0.5 rounded-[4px]">
                  {ticketCode}
                </span>
                <span className="font-mono text-xs font-bold bg-[#FCD03D] border border-[#151515] px-2.5 py-0.5 rounded-[4px]">
                  {service.category}
                </span>
                <span className="font-mono text-xs font-bold bg-[#FF5B2E] border border-[#151515] px-2.5 py-0.5 rounded-[4px]">
                  {service.serviceMode}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] leading-tight">
                {service.title}
              </h1>

              {/* Service Hero Image */}
              <div className="mt-5 h-[280px] sm:h-[380px] w-full bg-[#DEDAD0] border-2 border-[#151515] rounded-[8px] relative overflow-hidden shadow-[2px_2px_0px_#151515]">
                <Image
                  src={service.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 750px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Scope & Detailed Description */}
            <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-[#151515]">
                <Wrench className="w-4 h-4 text-[#FF5B2E]" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
                  Service Scope & Diagnostic Description
                </h2>
              </div>
              <p className="font-sans text-sm sm:text-base text-[#151515]/85 leading-relaxed font-normal whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* FixMate Quality & Workshop Guarantees */}
            <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-[#151515]">
                <ShieldCheck className="w-4 h-4 text-[#FCD03D]" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
                  Workshop Standards & Assurances
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    title: "90-Day Parts & Labor Warranty",
                    desc: "Free rework or replacement if the repaired issue reoccurs.",
                  },
                  {
                    title: "Genuine OEM Spare Parts",
                    desc: "Only authentic factory-graded components are installed.",
                  },
                  {
                    title: "$0 Upfront Prepayment",
                    desc: "Pay only after full post-repair inspection and sign-off.",
                  },
                  {
                    title: "Multi-Point Diagnostics",
                    desc: "Full hardware stress-testing before handing device back.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F5F0E6] border-2 border-[#151515] rounded-[8px] flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#151515] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-mono text-xs font-bold text-[#151515]">{item.title}</h4>
                      <p className="font-sans text-[11px] text-[#151515]/75 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Pricing, Technician Card & Interactive Booking (4 Cols Sticky) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
            
            {/* 1. Flat Pricing & Interactive Booking CTA Box */}
            <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-[10px] block text-[#151515]/70 uppercase font-bold">
                    Fixed Flat Estimate
                  </span>
                  <span className="font-mono text-3xl font-black text-[#151515]">
                    ${service.basePrice}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] block text-[#151515]/70 uppercase font-bold">
                    Est. Duration
                  </span>
                  <span className="font-mono text-xs font-bold text-[#151515] flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5 text-[#151515]" />
                    <span>{service.estimatedDuration || "1 - 2 Hours"}</span>
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-[#FEF9EF] border-2 border-dashed border-[#151515] rounded-[6px] text-[11px] font-mono text-[#151515]/80">
                ✨ No hidden surcharges. Includes diagnostic scan and labor.
              </div>

              {/* Client Interactive Booking Button (Opens Modal or Redirects to Sign In) */}
              <BookServiceButton service={service} />
            </div>

            {/* 2. Technician Profile Summary Card (Requirement R07) */}
            <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b-2 border-[#151515]">
                <Award className="w-4 h-4 text-[#FF5B2E]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
                  Assigned Master Technician
                </h3>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-[8px] bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] relative overflow-hidden shrink-0 flex items-center justify-center">
                  {service.technician?.image ? (
                    <Image
                      src={service.technician.image}
                      alt={technicianName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-heading font-black text-xl text-[#151515]">
                      {technicianName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-heading font-bold text-base text-[#151515] leading-snug">
                    {technicianName}
                  </h4>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-[#FEF9EF] border border-[#151515] px-1.5 py-0.5 rounded-[4px] mt-1 text-[#151515]">
                    ✓ Verified FixMate Pro
                  </span>
                </div>
              </div>

              <p className="font-sans text-xs text-[#151515]/75 leading-relaxed bg-[#F5F0E6] p-2.5 rounded-[6px] border border-[#151515]/30">
                &quot;{technicianBio}&quot;
              </p>

              <div className="space-y-2 pt-1 font-mono text-xs">
                <div className="flex items-start gap-2 text-[#151515]/80">
                  <MapPin className="w-3.5 h-3.5 text-[#151515] shrink-0 mt-0.5" />
                  <span className="text-[11px] font-medium leading-tight">
                    <strong className="text-[#151515]">Coverage:</strong> {technicianArea}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#151515]/80">
                  <Phone className="w-3.5 h-3.5 text-[#151515] shrink-0" />
                  <span className="text-[11px] font-medium">
                    <strong className="text-[#151515]">Direct:</strong> {technicianPhone}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}