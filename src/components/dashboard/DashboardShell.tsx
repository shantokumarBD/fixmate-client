"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  User,
  ClipboardList,
  PlusCircle,
  Users,
  ShieldCheck,
  Receipt,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { signOut } from "@/lib/auth/auth-client";
import toast from "react-hot-toast";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const role = user.role.toLowerCase();

  // Role-based Nav Items
  const customerNav: NavItem[] = [
    { label: "Overview", href: ROUTES.CUSTOMER.OVERVIEW, icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "My Bookings", href: ROUTES.CUSTOMER.BOOKINGS, icon: <CalendarCheck className="w-5 h-5" /> },
    { label: "Payments", href: ROUTES.CUSTOMER.PAYMENTS, icon: <CreditCard className="w-5 h-5" /> },
    { label: "Profile", href: ROUTES.PROFILE, icon: <User className="w-5 h-5" /> },
  ];

  const technicianNav: NavItem[] = [
    { label: "Overview", href: ROUTES.TECHNICIAN.OVERVIEW, icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Job Requests", href: ROUTES.TECHNICIAN.REQUESTS, icon: <ClipboardList className="w-5 h-5" /> },
    { label: "My Services", href: ROUTES.TECHNICIAN.MY_SERVICES, icon: <Wrench className="w-5 h-5" /> },
    { label: "Add Service", href: ROUTES.TECHNICIAN.ADD_SERVICE, icon: <PlusCircle className="w-5 h-5" /> },
    { label: "Profile", href: ROUTES.PROFILE, icon: <User className="w-5 h-5" /> },
  ];

  const adminNav: NavItem[] = [
    { label: "Overview", href: ROUTES.ADMIN.OVERVIEW, icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Users", href: ROUTES.ADMIN.USERS, icon: <Users className="w-5 h-5" /> },
    { label: "Services", href: ROUTES.ADMIN.SERVICES, icon: <ShieldCheck className="w-5 h-5" /> },
    { label: "Bookings", href: ROUTES.ADMIN.BOOKINGS, icon: <CalendarCheck className="w-5 h-5" /> },
    { label: "Transactions", href: ROUTES.ADMIN.TRANSACTIONS, icon: <Receipt className="w-5 h-5" /> },
    { label: "Profile", href: ROUTES.PROFILE, icon: <User className="w-5 h-5" /> },
  ];

  const navItems = role === "admin" ? adminNav : role === "technician" ? technicianNav : customerNav;

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success("Signed out successfully");
      router.push(ROUTES.SIGN_IN);
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
      setIsLoggingOut(false);
    }
  };

  const roleBadgeConfig: Record<string, { label: string; bg: string }> = {
    customer: { label: "CUSTOMER", bg: "bg-[#DBEAFE] text-[#1E40AF]" },
    technician: { label: "TECHNICIAN", bg: "bg-[#FCD03D] text-[#151515]" },
    admin: { label: "ADMIN", bg: "bg-[#FF5B2E] text-white" },
  };

  const currentRoleBadge = roleBadgeConfig[role] || { label: role.toUpperCase(), bg: "bg-white text-[#151515]" };

  const renderNavLinks = () => (
    <nav className="flex flex-col gap-1.5 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] text-sm font-heading font-bold transition-all ${
              isActive
                ? "bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] translate-x-1"
                : "text-[#C6C6C7] hover:text-white hover:bg-[#242424] border-2 border-transparent"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FEF9EF] flex">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-[#151515] border-r-2 border-[#151515] z-50 flex-col justify-between select-none">
        {/* Top: Logo & Nav */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo Brand Lockup */}
          <div className="h-16 px-5 border-b-2 border-neutral-800 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-[#FF5B2E] border-2 border-[#151515] rounded-[6px] flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg text-[#F5F0E6] tracking-tight leading-none">
                FixMate
              </span>
              <span className="font-mono text-[10px] text-[#A3A3A3] tracking-widest uppercase mt-0.5 font-bold">
                Workbench
              </span>
            </div>
          </div>

          {/* User Role Banner */}
          <div className="p-3 shrink-0">
            <div className="px-3 py-2 bg-[#242424] border-2 border-neutral-800 rounded-[6px] flex items-center justify-between">
              <span className="font-mono text-xs text-[#A3A3A3] font-bold">ACCESS BAY</span>
              <span className={`font-mono text-[11px] font-bold px-2 py-0.5 border border-[#151515] rounded-[4px] ${currentRoleBadge.bg}`}>
                {currentRoleBadge.label}
              </span>
            </div>
          </div>

          {/* Nav Links (Scrollable if screen is compact) */}
          <div className="flex-1 overflow-y-auto py-1">
            {renderNavLinks()}
          </div>
        </div>

        {/* ================= SIDEBAR BOTTOM: USER INFO & LOGOUT ================= */}
        <div className="p-3 border-t-2 border-neutral-800 flex flex-col gap-2.5 bg-[#1A1A1A] shrink-0">
          {/* User Card */}
          <div className="flex items-center gap-2.5 p-2 bg-[#242424] border-2 border-neutral-800 rounded-[6px]">
            <div className="w-8 h-8 rounded-full bg-[#FF5B2E] border-2 border-[#151515] flex items-center justify-center text-white font-bold text-xs shrink-0 uppercase shadow-[1px_1px_0px_#000]">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-heading font-bold text-xs text-[#F5F0E6] truncate leading-tight">
                {user.name || "FixMate User"}
              </span>
              <span className="font-mono text-[10px] text-[#A3A3A3] truncate">
                {user.email}
              </span>
            </div>
          </div>

          {/* Action Row: Back to Home & Sign Out */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={ROUTES.HOME}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#242424] text-[#C6C6C7] hover:text-white hover:bg-neutral-800 border-2 border-neutral-800 rounded-[6px] text-xs font-mono font-bold transition-all"
              title="Back to Public Site"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#FF5B2E] text-white hover:bg-[#B22B00] border-2 border-[#151515] rounded-[6px] text-xs font-heading font-bold uppercase transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer disabled:opacity-60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE DRAWER BACKDROP ================= */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#151515]/70 z-50 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR DRAWER ================= */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#151515] border-r-2 border-[#151515] z-50 flex flex-col justify-between transition-transform duration-200 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          <div className="h-16 px-4 border-b-2 border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#FF5B2E] border-2 border-[#151515] rounded flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-extrabold text-white text-base">FixMate</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-white hover:bg-neutral-800 rounded border border-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-3 shrink-0">
            <span className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 border border-[#151515] rounded ${currentRoleBadge.bg}`}>
              {currentRoleBadge.label} ACCESS
            </span>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {renderNavLinks()}
          </div>
        </div>

        {/* Mobile Sidebar Bottom */}
        <div className="p-3 border-t-2 border-neutral-800 flex flex-col gap-2 bg-[#1A1A1A] shrink-0">
          <div className="flex items-center gap-2 p-1.5 bg-[#242424] border border-neutral-800 rounded">
            <div className="w-7 h-7 rounded-full bg-[#FF5B2E] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] font-mono text-neutral-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={ROUTES.HOME}
              className="flex items-center justify-center gap-1.5 py-2 bg-[#242424] text-white border border-neutral-700 rounded text-xs font-mono font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-1.5 py-2 bg-[#FF5B2E] text-white border border-[#151515] rounded text-xs font-bold uppercase"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header: Clean Portal Header (No public navbar, No duplicate user chip) */}
        <header className="sticky top-0 h-14 sm:h-16 bg-[#FEF9EF] border-b-2 border-[#151515] z-40 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[6px] hover:bg-[#F2EDE3]"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5 text-[#151515]" />
            </button>

            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
              <span className="bg-[#151515] text-white px-2 py-0.5 font-bold border-2 border-[#151515] hidden sm:inline-block">
                PORTAL
              </span>
              <span className="text-neutral-400 hidden sm:inline">/</span>
              <span className="font-bold text-[#151515] text-xs sm:text-sm">
                {role.toUpperCase()} WORKBENCH
              </span>
            </div>
          </div>

          {/* Right: Station Telemetry Indicator */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] rounded-[4px] font-mono text-[11px] font-bold text-[#151515]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              SYS: ONLINE
            </span>
          </div>
        </header>

        {/* Dashboard Workbench Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}