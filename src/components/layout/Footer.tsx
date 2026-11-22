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

            {/* Social Media Links (PDF Page 2 Requirement) */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FixMate on X / Twitter"
                className="w-8 h-8 rounded-[6px] bg-neutral-900 border border-neutral-700 hover:border-[#FF5B2E] hover:text-[#FF5B2E] text-[#DEDAD0] flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FixMate on Facebook"
                className="w-8 h-8 rounded-[6px] bg-neutral-900 border border-neutral-700 hover:border-[#FF5B2E] hover:text-[#FF5B2E] text-[#DEDAD0] flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FixMate on LinkedIn"
                className="w-8 h-8 rounded-[6px] bg-neutral-900 border border-neutral-700 hover:border-[#FF5B2E] hover:text-[#FF5B2E] text-[#DEDAD0] flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.37a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FixMate on GitHub"
                className="w-8 h-8 rounded-[6px] bg-neutral-900 border border-neutral-700 hover:border-[#FF5B2E] hover:text-[#FF5B2E] text-[#DEDAD0] flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
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