"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface NavLinkItem {
  label: string;
  href: string;
  index: string;
}

export function MobileNav({ navLinks }: { navLinks: NavLinkItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="flex md:hidden items-center">
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
        className="w-10 h-10 bg-white border-2 border-[#151515] shadow-hard-sm flex items-center justify-center text-[#151515] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

     
      {isOpen && (
        <div className="fixed top-20 left-0 right-0 z-50 border-b-2 border-[#151515] bg-[#FEF9EF] px-5 py-6 flex flex-col gap-4 shadow-hard-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b-2 border-[#151515] pb-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#151515]/60 uppercase">
              NAVIGATION INDEX
            </span>
            <span className="text-[10px] font-mono font-bold bg-[#FCD03D] border border-[#151515] px-1.5 py-0.5 text-[#151515]">
              MOBILE MENU
            </span>
          </div>

          <nav className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center justify-between p-3.5 bg-white text-[#151515] hover:bg-[#F2EDE3] border-2 border-[#151515] rounded-[6px] shadow-hard-sm transition-all active:translate-x-[1px] active:translate-y-[1px]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-black text-[#FF5B2E]">
                    {link.index}
                  </span>
                  <span className="text-sm font-black uppercase tracking-wide">
                    {link.label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#151515]" />
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t-2 border-dashed border-[#151515] grid grid-cols-2 gap-3">
            <Link
              href={ROUTES.SIGN_IN}
              onClick={closeMenu}
              className="py-3 px-4 text-center bg-white text-[#151515] font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-[6px]"
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.SIGN_UP}
              onClick={closeMenu}
              className="py-3 px-4 text-center bg-[#FF5B2E] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-[6px]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}