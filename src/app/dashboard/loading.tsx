export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header Skeleton */}
      <div className="h-16 bg-[#151515]/5 border-2 border-[#151515]/20 rounded-[8px]" />

      {/* 3 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-28 bg-[#151515]/5 border-2 border-[#151515]/20 rounded-[10px]" />
        <div className="h-28 bg-[#151515]/5 border-2 border-[#151515]/20 rounded-[10px]" />
        <div className="h-28 bg-[#151515]/5 border-2 border-[#151515]/20 rounded-[10px]" />
      </div>

      {/* Table Skeleton */}
      <div className="h-64 bg-[#151515]/5 border-2 border-[#151515]/20 rounded-[10px]" />
    </div>
  );
}