import React from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { ROUTES } from "@/constants/routes";

const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME, index: "01" },
  { label: "Services", href: ROUTES.SERVICES, index: "02" },
  { label: "How It Works", href: ROUTES.ABOUT, index: "03" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 left-0 right-0 w-full z-40 bg-[#FEF9EF] border-b-2 border-[#151515]">
      <div className="h-20 max-w-[1200px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 h-full">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="h-full flex items-center font-bold text-xs uppercase tracking-wider text-[#151515]/80 hover:text-[#FF5B2E] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href={ROUTES.SIGN_IN}
            className="px-4 py-2 bg-white text-[#151515] font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-[6px]"
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.SIGN_UP}
            className="px-4 py-2 bg-[#FF5B2E] text-white font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-[6px]"
          >
            Sign Up
          </Link>
        </div>

        <MobileNav navLinks={NAV_LINKS} />
      </div>
    </header>
  );
}