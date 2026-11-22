"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Service } from "@/types/service";
import { updateServiceApprovalAction } from "@/actions/admin";
import { ApprovalBadge } from "@/components/shared/ApprovalBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ServiceInspectModal } from "@/components/dashboard/ServiceInspectModal";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  MapPin,
  Inbox,
  RotateCcw,
  Loader2,
} from "lucide-react";

interface AdminServicesTableProps {
  services: Service[];
}

type TabType = "all" | "pending" | "approved" | "rejected";

export function AdminServicesTable({ services }: AdminServicesTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [targetAction, setTargetAction] = useState<{
    service: Service;
    nextStatus: "approved" | "rejected";
  } | null>(null);
  const [inspectService, setInspectService] = useState<Service | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const tabs = [
    { id: "all" as TabType, label: "All Services", count: services.length },
    {
      id: "pending" as TabType,
      label: "Pending Review",
      count: services.filter((s) => s.approvalStatus === "pending").length,
    },
    {
      id: "approved" as TabType,
      label: "Approved",
      count: services.filter((s) => s.approvalStatus === "approved").length,
    },
    {
      id: "rejected" as TabType,
      label: "Rejected",
      count: services.filter((s) => s.approvalStatus === "rejected").length,
    },
  ];

  const filteredServices = services.filter((s) => {
    if (activeTab !== "all" && s.approvalStatus !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        s.title?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.technicianName?.toLowerCase().includes(q) ||
        s.technicianEmail?.toLowerCase().includes(q) ||
        s.serviceArea?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmModeration = () => {
    if (!targetAction) return;

    setProcessingId(targetAction.service._id);
    startTransition(async () => {
      const res = await updateServiceApprovalAction(
        targetAction.service._id,
        targetAction.nextStatus,
      );

      if (res.success) {
        toast.success(
          res.message || `Service marked as ${targetAction.nextStatus}`,
        );
        setTargetAction(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update service approval status");
      }
      setProcessingId(null);
    });
  };

  return (
    <div className="space-y-5">
      {/* Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5B403A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, technician name, category, or area..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all rounded-[6px]"
          />
        </div>

        <div className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 self-end sm:self-center">
          <span>CATALOG UNITS:</span>
          <span className="font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
            {filteredServices.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isPendingTab = tab.id === "pending" && tab.count > 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#151515] rounded-[6px] transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#151515] text-white shadow-[2px_2px_0px_#FF5B2E]"
                  : "bg-white text-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#FEF9EF]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                  isPendingTab
                    ? "bg-[#FF5B2E] text-white animate-pulse"
                    : isActive
                      ? "bg-[#FF5B2E] text-white"
                      : "bg-[#F2EDE3] text-[#151515]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden">
        {filteredServices.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center bg-[#FEF9EF]/30">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <Inbox className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              No Services Found
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-sm mt-1">
              No repair services match your current approval status tab or
              search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
              <thead>
                <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-4 font-extrabold min-w-[240px]">
                    Service Offering
                  </th>
                  <th className="py-3 px-3.5 font-extrabold min-w-[160px]">
                    Technician
                  </th>
                  <th className="py-3 px-3.5 font-extrabold min-w-[160px]">
                    Mode & Duration
                  </th>
                  <th className="py-3 px-3.5 font-extrabold whitespace-nowrap">
                    Base Quote
                  </th>
                  <th className="py-3 px-3.5 font-extrabold whitespace-nowrap text-center">
                    Approval Status
                  </th>
                  <th className="py-3 px-3.5 sm:px-4 font-extrabold text-right whitespace-nowrap min-w-[120px]">
                    Moderation Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#151515] font-sans">
                {filteredServices.map((s) => {
                  const isProcessing = processingId === s._id && isPending;

                  return (
                    <tr
                      key={s._id}
                      className="group hover:bg-[#FEF9EF]/50 transition-colors"
                    >
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#DEDAD0] border-2 border-[#151515] rounded-[6px] relative overflow-hidden shrink-0 shadow-[2px_2px_0px_#151515]">
                            <Image
                              src={
                                s.image ||
                                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"
                              }
                              alt={s.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0 max-w-[200px] sm:max-w-[250px]">
                            <span className="font-heading font-extrabold text-sm text-[#151515] leading-snug line-clamp-2">
                              {s.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="font-mono text-[10px] font-bold bg-[#F2EDE3] border border-[#151515] px-1.5 py-0.2 rounded uppercase text-[#151515]">
                                {s.category}
                              </span>

                              {/* Highlighted Neobrutalist Inspect Button */}
                              <button
                                type="button"
                                onClick={() => setInspectService(s)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FCD03D] hover:bg-[#FFE580] text-[#151515] border-2 border-[#151515] shadow-[1.5px_1.5px_0px_#151515] rounded-[4px] font-mono text-[11px] font-extrabold uppercase transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                                title="Inspect Complete Service Diagnostics"
                              >
                                <FileText className="w-3 h-3 text-[#151515]" />
                                <span>Inspect Full</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Technician */}
                      <td className="py-3 px-3.5">
                        <span className="font-heading font-extrabold text-sm text-[#151515] block truncate max-w-[150px]">
                          {s.technicianName || "Technician"}
                        </span>
                        <span className="font-mono text-xs text-[#5B403A] block truncate max-w-[150px] mt-0.5">
                          {s.technicianEmail}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold mt-1 ${
                            s.isAvailable ? "text-[#16A34A]" : "text-[#6B7280]"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              s.isAvailable ? "bg-[#16A34A]" : "bg-[#6B7280]"
                            }`}
                          ></span>
                          <span>{s.isAvailable ? "Online" : "Offline"}</span>
                        </span>
                      </td>

                      {/* Mode & Duration */}
                      <td className="py-3 px-3.5">
                        <span className="font-heading font-extrabold text-sm text-[#151515] block">
                          {s.serviceMode}
                        </span>
                        <span className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-[#5B403A] shrink-0" />
                          <span>{s.estimatedDuration}</span>
                        </span>
                        <span
                          className="font-mono text-[11px] text-[#5B403A] flex items-center gap-1 mt-1 max-w-[160px] truncate"
                          title={s.serviceArea}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{s.serviceArea}</span>
                        </span>
                      </td>

                      {/* Base Price */}
                      <td className="py-3 px-3.5 whitespace-nowrap font-mono font-black text-base text-[#151515]">
                        {formatCurrency(s.basePrice || 0)}
                      </td>

                      {/* Approval Status Badge */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-center">
                        <ApprovalBadge status={s.approvalStatus} />
                      </td>

                      {/* Moderation Actions (Stacked UP-DOWN) */}
                      <td className="py-3 px-3.5 sm:px-4 whitespace-nowrap text-right">
                        {isProcessing ? (
                          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#FF5B2E] font-bold">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : s.approvalStatus === "pending" ? (
                          /* Vertically Stacked Up-Down Buttons */
                          <div className="flex flex-col gap-1.5 items-end justify-center">
                            {/* Approve Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setTargetAction({
                                  service: s,
                                  nextStatus: "approved",
                                })
                              }
                              className="w-24 py-1.5 bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0] border-2 border-[#151515] rounded-[5px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                              title="Approve Service Listing"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            {/* Reject Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setTargetAction({
                                  service: s,
                                  nextStatus: "rejected",
                                })
                              }
                              className="w-24 py-1.5 bg-white text-[#DC2626] hover:bg-[#FEE2E2] border-2 border-[#151515] rounded-[5px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                              title="Reject Service Listing"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : s.approvalStatus === "approved" ? (
                          <div className="flex flex-col gap-1.5 items-end justify-center">
                            <button
                              type="button"
                              onClick={() =>
                                setTargetAction({
                                  service: s,
                                  nextStatus: "rejected",
                                })
                              }
                              className="w-24 py-1.5 bg-white text-[#DC2626] hover:bg-[#FEE2E2] border-2 border-[#151515] rounded-[5px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                              title="Revoke / Reject Service"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Revoke</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1.5 items-end justify-center">
                            <button
                              type="button"
                              onClick={() =>
                                setTargetAction({
                                  service: s,
                                  nextStatus: "approved",
                                })
                              }
                              className="w-28 py-1.5 bg-[#FEF9EF] text-[#16A34A] hover:bg-[#DCFCE7] border-2 border-[#151515] rounded-[5px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                              title="Re-Approve Service"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Re-Approve</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODULAR INSPECT MODAL ================= */}
      <ServiceInspectModal
        service={inspectService}
        onClose={() => setInspectService(null)}
        onAction={(service, nextStatus) => {
          setInspectService(null);
          setTargetAction({ service, nextStatus });
        }}
      />

      {/* ================= MODERATION CONFIRMATION DIALOG ================= */}
      <ConfirmDialog
        isOpen={!!targetAction}
        onClose={() => setTargetAction(null)}
        onConfirm={handleConfirmModeration}
        title={
          targetAction?.nextStatus === "approved"
            ? "Approve Repair Service Listing?"
            : "Reject Repair Service Listing?"
        }
        description={
          targetAction?.nextStatus === "approved"
            ? `Are you sure you want to approve "${targetAction?.service.title}" by ${targetAction?.service.technicianName}? It will become immediately discoverable in the public repair catalog.`
            : `Are you sure you want to reject "${targetAction?.service.title}"? It will be unlisted and hidden from public search.`
        }
        badge={
          targetAction?.nextStatus === "approved"
            ? "MODERATION // APPROVAL PUBLISH"
            : "MODERATION // REJECTION"
        }
        confirmText={
          targetAction?.nextStatus === "approved"
            ? "Yes, Approve Service"
            : "Yes, Reject Listing"
        }
        cancelText="Cancel"
        variant={targetAction?.nextStatus === "approved" ? "primary" : "danger"}
        isLoading={isPending}
      />
    </div>
  );
}