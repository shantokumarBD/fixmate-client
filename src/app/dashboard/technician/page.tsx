export default function TechnicianOverviewPage() {
  return (
    <div className="space-y-4">
      <div className="pb-4 border-b-2 border-[#151515]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            TECHNICIAN BAY
          </span>
          <span className="font-mono text-xs text-[#5B403A]">DISPATCH ACTIVE</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
          Technician Workbench Overview
        </h1>
        <p className="font-sans text-sm text-[#5B403A] mt-1">
          Review incoming hardware repair requests, update job stage status, and set final repair quotes.
        </p>
      </div>
    </div>
  );
}