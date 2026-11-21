import React from "react";

export default function ServiceDetailsLoading() {
  return (
    <main className="w-full min-h-screen bg-[#F5F0E6] py-8 animate-pulse text-[#151515]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-[#151515]/15 rounded w-48 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/70 border-2 border-[#151515] rounded-[10px] p-6 shadow-[4px_4px_0px_#151515] space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-[#151515]/15 rounded" />
                <div className="h-6 w-24 bg-[#151515]/15 rounded" />
              </div>
              <div className="h-8 bg-[#151515]/20 rounded w-3/4" />
              <div className="h-[320px] bg-[#151515]/10 rounded-[8px] w-full" />
            </div>

            <div className="bg-white/70 border-2 border-[#151515] rounded-[10px] p-6 shadow-[4px_4px_0px_#151515] space-y-3">
              <div className="h-5 w-40 bg-[#151515]/20 rounded mb-2" />
              <div className="h-4 bg-[#151515]/10 rounded w-full" />
              <div className="h-4 bg-[#151515]/10 rounded w-5/6" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="h-44 bg-white/70 border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515]" />
            <div className="h-64 bg-white/70 border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515]" />
          </div>
        </div>

      </div>
    </main>
  );
}