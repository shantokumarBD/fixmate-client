"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  RotateCcw,
  Filter,
  Layers,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import { SERVICE_CATEGORIES, SERVICE_MODES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

interface ServiceSidebarProps {
  currentFilters: {
    search?: string;
    category?: string;
    serviceMode?: string;
    sort?: string;
  };
  categoryCounts: Record<string, number>;
}

export function ServiceSidebar({ currentFilters, categoryCounts }: ServiceSidebarProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(currentFilters.search || "");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  
  const buildUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { ...currentFilters, ...updates };
    for (const [key, val] of Object.entries(merged)) {
      if (val?.trim()) params.set(key, val.trim());
    }
    return params.toString() ? `${ROUTES.SERVICES}?${params}` : ROUTES.SERVICES;
  };

  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      router.replace(buildUrl({ search: value }), { scroll: false });
    }, 350);
  };

 
  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchInput("");
    router.replace(buildUrl({ search: "" }), { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    router.replace(buildUrl({ search: searchInput }), { scroll: false });
  };

  const hasActiveFilters = Boolean(
    currentFilters.search ||
    currentFilters.category ||
    currentFilters.serviceMode ||
    currentFilters.sort
  );

  const totalAllServices = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const selectedCategoryCount = currentFilters.category
    ? categoryCounts[currentFilters.category] || 0
    : totalAllServices;

  return (
    <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-4.5 space-y-4">
      
      {/* 1. Header with Reset Button */}
      <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#151515]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF5B2E]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
            Filters & Search
          </span>
        </div>
        {hasActiveFilters && (
          <Link
            href={ROUTES.SERVICES}
            scroll={false}
            className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#FF5B2E] hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </Link>
        )}
      </div>

      {/* 2. Pure Event-Driven Search Input with Quick-Clear */}
      <div>
        <label className="block font-mono text-[11px] font-bold text-[#151515] uppercase mb-1.5">
          Search Repairs
        </label>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="e.g. Screen, Battery, AC..."
            className="w-full bg-[#F5F0E6] border-2 border-[#151515] rounded-[6px] pl-3 pr-14 py-2 text-xs font-mono font-medium text-[#151515] placeholder-[#151515]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 hover:bg-[#FFDAD6] text-[#DC2626] rounded transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="p-1.5 bg-[#FCD03D] border-2 border-[#151515] rounded-[4px] shadow-[1px_1px_0px_#151515] hover:bg-[#ffe066] cursor-pointer"
            >
              <Search className="w-3 h-3 text-[#151515]" />
            </button>
          </div>
        </form>
      </div>

      {/* 3. Category Dropdown */}
      <div className="relative">
        <label className="block font-mono text-[11px] font-bold text-[#151515] uppercase mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#151515]" />
          <span>Category</span>
        </label>
        
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FCD03D] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold text-[#151515] cursor-pointer hover:bg-[#ffe066] transition-colors relative z-40"
        >
          <span className="truncate">{currentFilters.category || "All Categories"}</span>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="font-bold text-[10px] bg-white border border-[#151515] px-1.5 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
              {selectedCategoryCount}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#151515] transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {/* Dropdown Menu & Click-Outside Backdrop */}
        {isCategoryOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsCategoryOpen(false)}
            />
            
            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border-2 border-[#151515] rounded-[8px] shadow-[4px_4px_0px_#151515] p-1.5 space-y-1 max-h-64 overflow-y-auto">
              <Link
                href={buildUrl({ category: "" })}
                scroll={false}
                onClick={() => setIsCategoryOpen(false)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-xs font-mono transition-all border-2 ${
                  !currentFilters.category
                    ? "bg-[#FCD03D] font-bold border-[#151515] shadow-[1px_1px_0px_#151515]"
                    : "border-transparent text-[#151515]/80 hover:bg-[#F5F0E6] hover:border-[#151515]/20 font-medium"
                }`}
              >
                <span>All Categories</span>
                <span className="font-bold text-[10px] bg-white border border-[#151515] px-1.5 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
                  {totalAllServices}
                </span>
              </Link>

              {SERVICE_CATEGORIES.map((cat) => {
                const isSelected = currentFilters.category === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <Link
                    key={cat}
                    href={buildUrl({ category: isSelected ? "" : cat })}
                    scroll={false}
                    onClick={() => setIsCategoryOpen(false)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-xs font-mono transition-all border-2 ${
                      isSelected
                        ? "bg-[#FCD03D] font-bold border-[#151515] shadow-[1px_1px_0px_#151515]"
                        : "border-transparent text-[#151515]/80 hover:bg-[#F5F0E6] hover:border-[#151515]/20 font-medium"
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    <span className="font-bold text-[10px] bg-white border border-[#151515] px-1.5 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 4. Service Mode Filter */}
      <div>
        <label className="block font-mono text-[11px] font-bold text-[#151515] uppercase mb-1.5 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#151515]" />
          <span>Service Mode</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {SERVICE_MODES.map((mode) => {
            const isSelected = currentFilters.serviceMode === mode;
            return (
              <Link
                key={mode}
                href={buildUrl({ serviceMode: isSelected ? "" : mode })}
                scroll={false}
                className={`text-center py-1.5 px-2 rounded-[6px] text-[11px] font-mono border-2 transition-all ${
                  isSelected
                    ? "bg-[#FCD03D] text-[#151515] font-bold border-[#151515] shadow-[2px_2px_0px_#151515]"
                    : "bg-[#F5F0E6] text-[#151515]/80 font-medium border-[#151515]/30 hover:border-[#151515]"
                }`}
              >
                {mode}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Sort By Filter */}
      <div>
        <label className="block font-mono text-[11px] font-bold text-[#151515] uppercase mb-1.5 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#151515]" />
          <span>Sort By</span>
        </label>
        <div className="space-y-1">
          {[
            { label: "Newest First", value: "" },
            { label: "Price: Low to High", value: "price_asc" },
            { label: "Price: High to Low", value: "price_desc" },
          ].map((item) => {
            const isSelected = (currentFilters.sort || "") === item.value;
            return (
              <Link
                key={item.label}
                href={buildUrl({ sort: item.value })}
                scroll={false}
                className={`block px-2.5 py-1.5 rounded-[6px] text-xs font-mono border-2 transition-all ${
                  isSelected
                    ? "bg-[#FCD03D] text-[#151515] font-bold border-[#151515] shadow-[2px_2px_0px_#151515]"
                    : "border-transparent text-[#151515]/80 hover:bg-[#F5F0E6] hover:border-[#151515]/20 font-medium"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}