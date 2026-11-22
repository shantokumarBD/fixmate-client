"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Service } from "@/types/service";
import { ApprovalBadge } from "@/components/shared/ApprovalBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  X,
  ExternalLink,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface ServiceInspectModalProps {
  service: Service | null;
  onClose: () => void;
  onAction: (service: Service, nextStatus: "approved" | "rejected") => void;
}

export function ServiceInspectModal({
  service,
  onClose,
  onAction,
}: ServiceInspectModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#151515]/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[8px_8px_0px_#151515] w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#151515] bg-[#FEF9EF] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#FCD03D] border-2 border-[#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase shadow-[1px_1px_0px_#151515]">
              {service.category}
            </span>
            <ApprovalBadge status={service.approvalStatus} />
            <span
              className={`font-mono text-[10px] font-bold px-2 py-0.5 border border-[#151515] rounded ${
                service.isAvailable
                  ? "bg-[#DCFCE7] text-[#16A34A]"
                  : "bg-[#F3F4F6] text-[#6B7280]"
              }`}
            >
              {service.isAvailable ? "● ONLINE" : "○ OFFLINE"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-white rounded border-2 border-transparent hover:border-[#151515] transition-all cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5 text-[#151515]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Image & Title Card */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-5 relative h-40 w-full bg-[#DEDAD0] border-2 border-[#151515] rounded-[8px] overflow-hidden shadow-[3px_3px_0px_#151515] shrink-0">
              <Image
                src={
                  service.image ||
                  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                }
                alt={service.title}
                fill
                sizes="(max-width: 640px) 100vw, 240px"
                className="object-cover"
              />
            </div>

            <div className="sm:col-span-7 space-y-2">
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#151515] leading-snug">
                {service.title}
              </h3>
              <div className="flex items-center gap-2 font-mono text-xs text-[#5B403A]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted: {formatDate(service.createdAt)}</span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/services/${service._id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] border border-[#2563EB] px-2.5 py-1 rounded hover:underline"
                >
                  <span>View Live Public Preview</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Core Financial & Execution Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div className="p-2.5 bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px]">
              <span className="text-[10px] text-[#5B403A] font-bold block uppercase">
                Base Quote
              </span>
              <span className="text-base font-extrabold text-[#16A34A] block mt-0.5">
                {formatCurrency(service.basePrice || 0)}
              </span>
            </div>

            <div className="p-2.5 bg-white border-2 border-[#151515] rounded-[6px]">
              <span className="text-[10px] text-[#5B403A] font-bold block uppercase">
                Duration
              </span>
              <span className="text-xs font-bold text-[#151515] block mt-1 truncate">
                {service.estimatedDuration || "N/A"}
              </span>
            </div>

            <div className="p-2.5 bg-white border-2 border-[#151515] rounded-[6px]">
              <span className="text-[10px] text-[#5B403A] font-bold block uppercase">
                Service Mode
              </span>
              <span className="text-xs font-bold text-[#151515] block mt-1 truncate">
                {service.serviceMode}
              </span>
            </div>

            <div className="p-2.5 bg-white border-2 border-[#151515] rounded-[6px]">
              <span className="text-[10px] text-[#5B403A] font-bold block uppercase">
                Coverage Area
              </span>
              <span
                className="text-xs font-bold text-[#151515] block mt-1 truncate"
                title={service.serviceArea}
              >
                {service.serviceArea}
              </span>
            </div>
          </div>

          {/* Technician Identity Card */}
          <div className="p-3 bg-white border-2 border-[#151515] rounded-[6px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#FCD03D] border-2 border-[#151515] rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-[1px_1px_0px_#151515]">
                {service.technicianName?.charAt(0) || "T"}
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-[#151515] block leading-tight">
                  {service.technicianName}
                </span>
                <span className="font-mono text-xs text-[#5B403A] block">
                  {service.technicianEmail}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold bg-[#FEF9EF] border border-[#151515] px-2 py-0.5 rounded text-[#151515]">
              VERIFIED SPECIALIST
            </span>
          </div>

          {/* Problem Scope Description */}
          <div>
            <span className="font-mono text-[11px] uppercase font-bold text-[#5B403A] block mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5B2E]" />
              <span>Technical Problem Scope & Diagnosis Description:</span>
            </span>
            <div className="p-3.5 bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] text-xs sm:text-sm text-[#151515] leading-relaxed whitespace-pre-wrap font-sans">
              {service.description}
            </div>
          </div>
        </div>

        {/* Modal Action Footer: Direct Moderation Buttons */}
        <div className="p-4 sm:p-5 border-t-2 border-[#151515] bg-[#FEF9EF] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white text-[#151515] hover:bg-[#F2EDE3] border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_#151515] cursor-pointer"
          >
            Close Inspector
          </button>

          {/* Quick Actions Right Inside the Modal */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {service.approvalStatus === "pending" ? (
              <>
                <button
                  type="button"
                  onClick={() => onAction(service, "rejected")}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-white text-[#DC2626] hover:bg-[#FEE2E2] border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_#151515] cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Listing</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAction(service, "approved")}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#10B981] text-white hover:bg-[#059669] border-2 border-[#151515] rounded-[6px] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000000] cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Service</span>
                </button>
              </>
            ) : service.approvalStatus === "approved" ? (
              <button
                type="button"
                onClick={() => onAction(service, "rejected")}
                className="w-full sm:w-auto px-4 py-2 bg-white text-[#DC2626] hover:bg-[#FEE2E2] border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_#151515] cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Revoke / Reject Service</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onAction(service, "approved")}
                className="w-full sm:w-auto px-4 py-2 bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0] border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_#151515] cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-Approve Service</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}