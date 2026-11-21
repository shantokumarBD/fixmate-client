export default function AdminOverviewPage() {
  return (
    <div className="space-y-4">
      <div className="pb-4 border-b-2 border-[#151515]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            ROOT CONSOLE
          </span>
          <span className="font-mono text-xs text-[#5B403A]">OPERATOR DISPATCH</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
          Admin Control Console
        </h1>
        <p className="font-sans text-sm text-[#5B403A] mt-1">
          Manage system-wide technicians, moderate pending catalog services, and inspect global revenue transactions.
        </p>
      </div>
    </div>
  );
}