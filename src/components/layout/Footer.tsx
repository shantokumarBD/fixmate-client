import React from "react";
import Link from "next/link";
import { Wrench, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { SERVICE_CATEGORIES } from "@/constants/roles";

export function Footer() {
  return (
    <footer className="w-full bg-[#151515] text-[#FEF9EF] border-t-2 border-[#151515]">
      <div className="max-w-[1200px] mx-auto py-12 sm:py-16 px-4 sm:px-8">
        {/* মূল ৪-কলাম গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b-2 border-neutral-800">
          {/* কলাম ১: ব্র্যান্ড ও গ্যারান্টি ব্যাজ (lg:col-span-4) */}
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

          {/* কলাম ২: কুইক লিংকস (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold text-[#DEDAD0]">
              <li>
                <Link
                  href={ROUTES.HOME}
                  className="hover:text-[#FF5B2E] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.SERVICES}
                  className="hover:text-[#FF5B2E] transition-colors"
                >
                  Services Catalog
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ABOUT}
                  className="hover:text-[#FF5B2E] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.SIGN_IN}
                  className="hover:text-[#FF5B2E] transition-colors"
                >
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.SIGN_IN}
                  className="hover:text-[#FF5B2E] transition-colors"
                >
                  Technician Bay
                </Link>
              </li>
            </ul>
          </div>

          {/* কলাম ৩: ৭টি অফিসিয়াল ক্যাটাগরি (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-white">
              7 Core Categories
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-semibold text-[#DEDAD0]">
              {SERVICE_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`${ROUTES.SERVICES}?category=${encodeURIComponent(category)}`}
                    className="hover:text-[#FF5B2E] transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* কলাম ৪: ডিসপ্যাচ হেডকোয়ার্টার (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Dispatch HQ
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#DEDAD0]">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#FF5B2E] shrink-0 mt-0.5" />
                <span>support@fixmate.io</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#FF5B2E] shrink-0 mt-0.5" />
                <span>1-800-FIX-MATE (24/7 Dispatch)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF5B2E] shrink-0 mt-0.5" />
                <span>104 Industrial Way, Suite 4B, Workshop District</span>
              </div>
            </div>

            {/* লাইভ ফ্লিট স্ট্যাটাস লাইট */}
            <div className="mt-2 pt-3 border-t border-neutral-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FCD03D] animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#DEDAD0] font-bold">
                Fleet Status: Active Live
              </span>
            </div>
          </div>
        </div>

        {/* বটম বার: কপিরাইট ও নতুন X লোগো সহ সোশ্যাল বাটন */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#DEDAD0]">
          <p className="font-medium text-center sm:text-left">
            Copyright © 2026 FixMate Technologies Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-2.5">
            {/* ১. নতুন অফিসিয়াল X লোগো */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Official X Profile"
              className="w-8 h-8 rounded-[6px] bg-white text-[#151515] border-2 border-white shadow-[2px_2px_0px_#FFFFFF] flex items-center justify-center hover:bg-[#FCD03D] hover:border-[#FCD03D] hover:shadow-[2px_2px_0px_#FCD03D] transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* ২. গিটহাব ভেক্টর */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="w-8 h-8 rounded-[6px] bg-white text-[#151515] border-2 border-white shadow-[2px_2px_0px_#FFFFFF] flex items-center justify-center hover:bg-[#FCD03D] hover:border-[#FCD03D] hover:shadow-[2px_2px_0px_#FCD03D] transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>

            {/* ৩. লিঙ্কডইন ভেক্টর */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Page"
              className="w-8 h-8 rounded-[6px] bg-white text-[#151515] border-2 border-white shadow-[2px_2px_0px_#FFFFFF] flex items-center justify-center hover:bg-[#FCD03D] hover:border-[#FCD03D] hover:shadow-[2px_2px_0px_#FCD03D] transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>

            {/* ৪. ইনস্টাগ্রাম ভেক্টর */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="w-8 h-8 rounded-[6px] bg-[#FF5B2E] text-white border-2 border-white shadow-[2px_2px_0px_#FFFFFF] flex items-center justify-center hover:bg-[#FCD03D] hover:text-[#151515] hover:border-[#FCD03D] hover:shadow-[2px_2px_0px_#FCD03D] transition-all cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5 fill-none stroke-current stroke-2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}