"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { SERVICE_CATEGORIES } from "@/constants/roles";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#151515] text-[#FEF9EF] border-t-2 border-[#151515]">
      <div className="max-w-[1200px] mx-auto py-12 sm:py-16 px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b-2 border-neutral-800">
          {/* Column 1: Brand & Guarantee */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-3 select-none group w-fit"
            >
              <div className="w-10 h-10 bg-[#FF5B2E] border-2 border-white rounded-[8px] flex items-center justify-center text-white shadow-[2px_2px_0px_#FFFFFF] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform">
                <Wrench className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white uppercase">
                FixMate
              </span>
            </Link>

            <p className="text-sm text-[#DEDAD0] leading-relaxed max-w-sm">
              The on-demand verified technician marketplace. Step-by-step
              diagnostic tracking, zero upfront surprise fees, pay only when
              fully fixed.
            </p>

            <div className="inline-flex items-center gap-2 self-start bg-[#241A00] border-2 border-[#FCD03D] px-3 py-1.5 rounded-[6px] shadow-[2px_2px_0px_#FCD03D]">
              <ShieldCheck className="w-4 h-4 text-[#FCD03D]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FCD03D] font-bold">
                Verified Repair Guarantee
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-[#DEDAD0]">
              <li>
                <Link href={ROUTES.HOME} className="hover:text-[#FF5B2E] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={ROUTES.SERVICES} className="hover:text-[#FF5B2E] transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href={ROUTES.ABOUT} className="hover:text-[#FF5B2E] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href={ROUTES.SIGN_IN} className="hover:text-[#FF5B2E] transition-colors">
                  Technician Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Repair Categories */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-xs font-semibold text-[#DEDAD0]">
              {SERVICE_CATEGORIES.slice(0, 5).map((category) => (
                <li key={category}>
                  <Link
                    href={`${ROUTES.SERVICES}?category=${encodeURIComponent(category)}`}
                    className="hover:text-[#FF5B2E] transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#FCD03D] font-mono text-[10px]">#</span>
                    <span>{category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Emergency Dispatch
            </h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-[#DEDAD0]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF5B2E] shrink-0" />
                <span className="font-mono">+1 (800) 349-6283</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF5B2E] shrink-0" />
                <span className="font-mono">dispatch@fixmate.io</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF5B2E] shrink-0" />
                <span>FixMate HQ, Tech District 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#A3A3A3]">
          <p>© {new Date().getFullYear()} FixMate Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Security Inspected</span>
            <span className="text-neutral-600">|</span>
            <span className="text-[#FCD03D]">v2.4 Live Workbench</span>
          </div>
        </div>
      </div>
    </footer>
  );
}