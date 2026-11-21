"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Service } from "@/types/service";
import { toggleAvailabilityAction, deleteServiceAction } from "@/actions/service";
import { ApprovalBadge } from "@/components/shared/ApprovalBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  Search,
  Wrench,
  Trash2,
  PlusCircle,
  Inbox,
  Power,
  Loader2,
} from "lucide-react";

interface TechnicianServicesTableProps {
  services: Service[];
}

type TabType = "all" | "approved" | "pending" | "rejected";

export function TechnicianServicesTable({ services }: TechnicianServicesTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [targetDeleteService, setTargetDeleteService] = useState<Service | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ১. ট্যাব কাউন্টার
  const tabs = [
    { id: "all" as TabType, label: "All Services", count: services.length },
    {
      id: "approved" as TabType,
      label: "Approved",
      count: services.filter((s) => s.approvalStatus === "approved").length,
    },
    {
      id: "pending" as TabType,
      label: "Pending",
      count: services.filter((s) => s.approvalStatus === "pending").length,
    },
    {
      id: "rejected" as TabType,
      label: "Rejected",
      count: services.filter((s) => s.approvalStatus === "rejected").length,
    },
  ];

  // ২. ফিল্টারিং লজিক
  const filteredServices = services.filter((s) => {
    if (activeTab !== "all" && s.approvalStatus !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        s.title?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.serviceArea?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ৩. Challenge 1: Availability Switch Toggle
  const handleToggleAvailability = async (service: Service) => {
    try {
      setTogglingId(service._id);
      const nextStatus = !service.isAvailable;
      const res = await toggleAvailabilityAction(service._id, nextStatus);

      if (res.success) {
        toast.success(
          `Service marked ${nextStatus ? "Available (Online)" : "Unavailable (Offline)"}`
        );
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update availability");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  // ৪. Delete Service Confirmation Action
  const handleConfirmDelete = () => {
    if (!targetDeleteService) return;

    startDeleteTransition(async () => {
      const res = await deleteServiceAction(targetDeleteService._id);
      if (res.success) {
        toast.success(res.message || "Service deleted successfully");
        setTargetDeleteService(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete service");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5B403A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your services by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all rounded-[6px]"
          />
        </div>

        <div className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 self-end sm:self-center">
          <span>CATALOG COUNT:</span>
          <span className="font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
            {filteredServices.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
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
                  isActive ? "bg-[#FF5B2E] text-white" : "bg-[#F2EDE3] text-[#151515]"
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
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-sm mt-1 mb-4">
              {searchQuery || activeTab !== "all"
                ? "No services matched your current moderation filter or search keyword."
                : "You haven't listed any repair services yet. Publish your technical skills to start receiving jobs."}
            </p>
            <Link
              href={ROUTES.TECHNICIAN.ADD_SERVICE}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-bold text-xs uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform rounded-[6px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Service</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase">
                  <th className="py-3 px-4 font-bold tracking-wider">Service</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Mode & Area</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Base Quote</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Approval</th>
                  <th className="py-3 px-4 font-bold tracking-wider text-center">Availability (Ch.1)</th>
                  <th className="py-3 px-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#151515] font-sans text-xs sm:text-sm">
                {filteredServices.map((s) => {
                  const isToggling = togglingId === s._id;

                  return (
                    <tr key={s._id} className="hover:bg-[#FEF9EF]/50 transition-colors">
                      {/* Service Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#DEDAD0] border-2 border-[#151515] rounded-[6px] relative overflow-hidden shrink-0">
                            <Image
                              src={s.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"}
                              alt={s.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-heading font-bold text-[#151515] leading-tight truncate max-w-xs">
                              {s.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[10px] font-bold bg-[#F2EDE3] border border-[#151515] px-1.5 py-0.2 rounded-[3px] uppercase text-[#151515]">
                                {s.category}
                              </span>
                              <span className="font-mono text-[10px] text-[#5B403A]">
                                {s.estimatedDuration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Mode & Area */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-[#151515] block">
                          {s.serviceMode}
                        </span>
                        <span className="font-mono text-[11px] text-[#5B403A]">
                          {s.serviceArea}
                        </span>
                      </td>

                      {/* Base Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-extrabold text-[#151515]">
                        {formatCurrency(s.basePrice || 0)}
                      </td>

                      {/* Approval Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <ApprovalBadge status={s.approvalStatus} />
                      </td>

                      {/* Challenge 1: Availability Switch Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(s)}
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#151515] transition-all cursor-pointer shadow-[2px_2px_0px_#151515] disabled:opacity-50 ${
                            s.isAvailable
                              ? "bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0]"
                              : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                          }`}
                        >
                          {isToggling ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Power className="w-3.5 h-3.5" />
                          )}
                          <span>{s.isAvailable ? "Online" : "Offline"}</span>
                        </button>
                      </td>

                      {/* Action: Delete */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => setTargetDeleteService(s)}
                          className="p-1.5 bg-white hover:bg-[#FEE2E2] text-[#DC2626] border-2 border-[#DC2626] rounded-[6px] shadow-[2px_2px_0px_#DC2626] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!targetDeleteService}
        onClose={() => setTargetDeleteService(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Repair Service?"
        description={`Are you sure you want to delete "${targetDeleteService?.title}"? This service will be permanently unlisted from the platform.`}
        badge="DANGER // PERMANENT REMOVAL"
        confirmText="Yes, Delete Service"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}