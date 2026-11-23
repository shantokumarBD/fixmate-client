import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { PaginationMeta } from "@/types/service";

interface PaginationControlsProps {
  pagination: PaginationMeta;
  currentFilters: {
    search?: string;
    category?: string;
    serviceMode?: string;
    sort?: string;
    page?: string;
    limit?: string;
  };
}

export function PaginationControls({
  pagination,
  currentFilters,
}: PaginationControlsProps) {
  const { page, totalPages, hasNextPage, hasPrevPage, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(currentFilters)) {
      if (key !== "page" && val && String(val).trim()) {
        params.set(key, String(val).trim());
      }
    }
    params.set("page", String(targetPage));
    return `${ROUTES.SERVICES}?${params.toString()}`;
  };

  // Generate page numbers window with ellipsis for large ranges
  const generatePages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = generatePages();
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="w-full bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Summary counter */}
      <div className="font-mono text-xs text-[#151515] font-semibold text-center sm:text-left">
        Showing{" "}
        <span className="font-bold text-[#FF5B2E]">
          {startItem}–{endItem}
        </span>{" "}
        of <span className="font-bold">{total}</span> services
        <span className="hidden md:inline text-[#151515]/60 ml-2">
          (Page {page} of {totalPages})
        </span>
      </div>

      {/* Right: Controls & Page buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous Button */}
        {hasPrevPage ? (
          <Link
            href={buildPageUrl(page - 1)}
            scroll={false}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold text-[#151515] hover:bg-[#FCD03D] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#151515]" />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#F5F0E6] border-2 border-[#151515]/30 rounded-[6px] font-mono text-xs font-bold text-[#151515]/40 cursor-not-allowed"
            aria-disabled="true"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#151515]/40" />
            <span className="hidden sm:inline">Prev</span>
          </button>
        )}

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1.5 py-1 font-mono text-xs font-bold text-[#151515]/50 select-none"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === page;

            return isCurrent ? (
              <span
                key={p}
                className="w-8 h-8 flex items-center justify-center bg-[#FF5B2E] text-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-extrabold select-none"
                aria-current="page"
              >
                {p}
              </span>
            ) : (
              <Link
                key={p}
                href={buildPageUrl(p)}
                scroll={false}
                className="w-8 h-8 flex items-center justify-center bg-white text-[#151515] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold hover:bg-[#FCD03D] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {hasNextPage ? (
          <Link
            href={buildPageUrl(page + 1)}
            scroll={false}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold text-[#151515] hover:bg-[#FCD03D] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
            aria-label="Next Page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#151515]" />
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#F5F0E6] border-2 border-[#151515]/30 rounded-[6px] font-mono text-xs font-bold text-[#151515]/40 cursor-not-allowed"
            aria-disabled="true"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#151515]/40" />
          </button>
        )}
      </div>
    </div>
  );
}
