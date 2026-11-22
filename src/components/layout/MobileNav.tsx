"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { Menu, X, ArrowRight, LayoutDashboard, User as UserIcon, LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { signOut } from "@/lib/auth/auth-client";
import { RoleBadge } from "@/components/shared/RoleBadge";

interface NavLinkItem {
  label: string;
  href: string;
  index: string;
}

interface MobileNavProps {
  navLinks: NavLinkItem[];
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
  isLoading?: boolean;
}

export function MobileNav({ navLinks, user, isLoading = false }: MobileNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    closeMenu();
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push(ROUTES.SIGN_IN);
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const role = user?.role || "customer";
  const dashboardHref =
    role === "admin"
      ? ROUTES.ADMIN.OVERVIEW
      : role === "technician"
      ? ROUTES.TECHNICIAN.OVERVIEW
      : ROUTES.CUSTOMER.OVERVIEW;

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

          {/* User Profile Card on Mobile if Logged In */}
          {!isLoading && user && (
            <div className="p-3 bg-white border-2 border-[#151515] rounded-[6px] shadow-hard-sm flex flex-col gap-1">
              <span className="font-heading font-extrabold text-sm uppercase text-[#151515]">
                {user.name || "Operator"}
              </span>
              <span className="font-mono text-xs text-[#5B403A] truncate">
                {user.email || ""}
              </span>
              <div className="mt-1">
                <RoleBadge role={role} />
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-2.5">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== ROUTES.HOME && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between p-3.5 border-2 border-[#151515] rounded-[6px] shadow-hard-sm transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                    isActive
                      ? "bg-[#FF5B2E] text-white"
                      : "bg-white text-[#151515] hover:bg-[#F2EDE3]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-black ${
                        isActive ? "text-white" : "text-[#FF5B2E]"
                      }`}
                    >
                      {link.index}
                    </span>
                    <span className="font-heading font-extrabold text-sm uppercase">
                      {link.label}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-[#151515]/60"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Dashboard & Profile Links for Logged In User */}
            {!isLoading && user && (
              <>
                <Link
                  href={dashboardHref}
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3.5 bg-[#FCD03D] text-[#151515] border-2 border-[#151515] rounded-[6px] shadow-hard-sm transition-all active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm font-black uppercase tracking-wide">
                      Dashboard
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#151515]" />
                </Link>

                <Link
                  href={ROUTES.PROFILE}
                  onClick={closeMenu}
                  className="flex items-center justify-between p-3.5 bg-white text-[#151515] border-2 border-[#151515] rounded-[6px] shadow-hard-sm transition-all active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-black uppercase tracking-wide">
                      Profile Settings
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#151515]" />
                </Link>
              </>
            )}
          </nav>

          {/* Bottom Auth Buttons */}
          <div className="pt-3 border-t-2 border-dashed border-[#151515]">
            {isLoading ? (
              <div className="h-10 w-full bg-[#151515]/10 rounded-[6px] animate-pulse" />
            ) : user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-3 px-4 text-center bg-[#FFDAD6] text-[#BA1A1A] font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm flex items-center justify-center gap-2 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
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
                  className="py-3 px-4 text-center bg-[#FF5B2E] text-[#151515] font-bold text-xs uppercase tracking-wider border-2 border-[#151515] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-[6px]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}