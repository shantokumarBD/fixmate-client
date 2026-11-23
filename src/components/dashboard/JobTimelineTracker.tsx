import React from "react";
import { Booking } from "@/types/booking";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaymentBadge } from "@/components/shared/PaymentBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  Wrench,
  CheckSquare,
  CreditCard,
  Ban,
  XCircle,
  Calendar,
  FileText,
  User,
} from "lucide-react";

interface JobTimelineTrackerProps {
  booking: Booking;
}

interface TimelineStage {
  id: string;
  title: string;
  description: string;
  state: "completed" | "current" | "pending" | "terminal";
  timestamp?: string;
  note?: string;
  icon: React.ReactNode;
}

export function JobTimelineTracker({ booking }: JobTimelineTrackerProps) {
  const status = (booking.status || "requested").toLowerCase();
  const paymentStatus = (booking.paymentStatus || "unpaid").toLowerCase();
  const isTerminalCancelled = status === "cancelled";
  const isTerminalRejected = status === "rejected";
  const isTerminal = isTerminalCancelled || isTerminalRejected;

  // Extract history map for fast lookup
  const history = Array.isArray(booking.statusHistory) && booking.statusHistory.length > 0
    ? booking.statusHistory
    : [
        {
          status: booking.status,
          changedAt: booking.createdAt,
          note: "Initial order manifest created",
        },
      ];

  const getHistoryEntry = (targetStatus: string) => {
    return history.find((h) => h.status?.toLowerCase() === targetStatus.toLowerCase());
  };

  const reqEntry = getHistoryEntry("requested") || { changedAt: booking.createdAt, note: "Booking request submitted" };
  const accEntry = getHistoryEntry("accepted");
  const progEntry = getHistoryEntry("in-progress") || getHistoryEntry("in_progress");
  const compEntry = getHistoryEntry("completed");
  const termEntry = getHistoryEntry(status);

  // Construct canonical timeline stages
  const stages: TimelineStage[] = [
    {
      id: "requested",
      title: "1. Request Submitted",
      description: "Customer submitted problem manifest",
      state: "completed",
      timestamp: reqEntry.changedAt,
      note: reqEntry.note,
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "accepted",
      title: isTerminalCancelled
        ? "2. Order Cancelled"
        : isTerminalRejected
        ? "2. Order Declined"
        : "2. Technician Accepted",
      description: isTerminalCancelled
        ? "Cancelled by customer"
        : isTerminalRejected
        ? "Declined by technician"
        : "Assigned technician confirmed job",
      state: isTerminal
        ? "terminal"
        : ["accepted", "in-progress", "in_progress", "completed"].includes(status)
        ? "completed"
        : "pending",
      timestamp: isTerminal ? termEntry?.changedAt : accEntry?.changedAt,
      note: isTerminal ? termEntry?.note : accEntry?.note,
      icon: isTerminalCancelled ? (
        <Ban className="w-4 h-4" />
      ) : isTerminalRejected ? (
        <XCircle className="w-4 h-4" />
      ) : (
        <CheckCircle2 className="w-4 h-4" />
      ),
    },
    {
      id: "in-progress",
      title: "3. Repair Underway",
      description: "Hardware diagnostics and bench testing",
      state: isTerminal
        ? "pending"
        : ["in-progress", "in_progress"].includes(status)
        ? "current"
        : ["completed"].includes(status)
        ? "completed"
        : "pending",
      timestamp: progEntry?.changedAt,
      note: progEntry?.note,
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      id: "completed",
      title: "4. Repair Completed",
      description: `Final service inspection (${formatCurrency(booking.finalAmount || booking.basePrice || 0)})`,
      state: isTerminal
        ? "pending"
        : status === "completed"
        ? "completed"
        : "pending",
      timestamp: compEntry?.changedAt,
      note: compEntry?.note,
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      id: "paid",
      title: "5. Payment Settlement",
      description: paymentStatus === "paid" ? "Stripe escrow payment verified" : "Pending customer checkout",
      state: isTerminal
        ? "pending"
        : paymentStatus === "paid"
        ? "completed"
        : status === "completed"
        ? "current"
        : "pending",
      timestamp: paymentStatus === "paid" ? (history[history.length - 1]?.changedAt || compEntry?.changedAt) : undefined,
      note: paymentStatus === "paid" ? "Payment cleared and warranty activated" : "Pay-after-service model",
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Overview Cards */}
      <div className="bg-[#FEF9EF] border-2 border-[#151515] rounded-[8px] p-4 shadow-[2px_2px_0px_#151515] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#5B403A] block">
            Work Order Status
          </span>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={booking.status} />
            <PaymentBadge status={booking.paymentStatus} />
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#5B403A] block">
            Technician Assigned
          </span>
          <div className="mt-1 flex items-center gap-1.5 font-sans text-xs font-bold text-[#151515]">
            <User className="w-3.5 h-3.5 text-[#FF5B2E]" />
            <span>{booking.technicianName || "Certified Specialist"}</span>
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#5B403A] block">
            Settlement Quote
          </span>
          <div className="mt-1 font-mono text-sm font-extrabold text-[#151515]">
            {formatCurrency(booking.finalAmount || booking.basePrice || 0)}
          </div>
        </div>
      </div>

      {/* 2. Visual Stepper Timeline */}
      <div className="space-y-0">
        {stages.map((stage, idx) => {
          const isDone = stage.state === "completed";
          const isCurrent = stage.state === "current";
          const isTerm = stage.state === "terminal";
          const isLast = idx === stages.length - 1;

          // Solid Opaque Circle Marker Styles (Zero transparency bleed-through)
          let circleBg = "bg-[#F5F0E6] text-[#151515]/40 border-2 border-[#151515]/30";
          if (isDone) {
            circleBg = "bg-[#10B981] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]";
          } else if (isCurrent) {
            circleBg = "bg-[#FCD03D] text-[#151515] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] ring-4 ring-[#FF5B2E]/30";
          } else if (isTerm) {
            circleBg = "bg-[#DC2626] text-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515]";
          }

          // Dynamic connecting line style
          let lineBg = "bg-[#151515]/20";
          if (isDone) {
            lineBg = "bg-[#10B981]";
          } else if (isCurrent) {
            lineBg = "bg-[#151515]";
          }

          return (
            <div key={stage.id} className="flex items-stretch gap-3 sm:gap-4">
              {/* Left Column: 100% Mathematically Centered Marker & Connecting Line */}
              <div className="flex flex-col items-center shrink-0 w-8">
                {/* Node Circle with outer ping animation for active state (No opacity fade on circle itself) */}
                <div className="relative flex items-center justify-center shrink-0">
                  {isCurrent && (
                    <span className="absolute w-8 h-8 rounded-full bg-[#FF5B2E]/40 animate-ping pointer-events-none" />
                  )}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-transform ${circleBg}`}
                  >
                    {stage.icon}
                  </div>
                </div>

                {/* Line to next stage (cleanly terminates at the final stage) */}
                {!isLast && (
                  <div className={`w-[3px] grow my-1 rounded-full ${lineBg}`} />
                )}
              </div>

              {/* Right Column: Stage Content Card */}
              <div className="grow pb-5 sm:pb-6">
                <div
                  className={`border-2 rounded-[8px] p-3.5 transition-all ${
                    isCurrent
                      ? "bg-white border-[#151515] shadow-[3px_3px_0px_#FF5B2E]"
                      : isDone
                      ? "bg-white border-[#151515] shadow-[2px_2px_0px_#151515]"
                      : isTerm
                      ? "bg-[#FEF2F2] border-[#DC2626] shadow-[2px_2px_0px_#DC2626]"
                      : "bg-[#F5F0E6]/60 border-[#151515]/20 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-heading font-extrabold text-sm text-[#151515] flex items-center gap-2">
                      <span>{stage.title}</span>
                      {isCurrent && (
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-[#FF5B2E] text-white rounded font-bold">
                          ACTIVE STAGE
                        </span>
                      )}
                    </h4>

                    {stage.timestamp && (
                      <span className="font-mono text-[11px] font-bold text-[#5B403A]">
                        {formatDate(stage.timestamp)}
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-xs text-[#5B403A] mt-0.5">
                    {stage.description}
                  </p>

                  {stage.note && (
                    <div className="mt-2.5 bg-[#FEF9EF] border border-[#151515] rounded-[4px] p-2 font-mono text-[11px] text-[#151515] flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#FF5B2E] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Log Note: </span>
                        <span>{stage.note}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Audit Log Table */}
      <div className="bg-white border-2 border-[#151515] rounded-[8px] shadow-[3px_3px_0px_#151515] overflow-hidden">
        <div className="bg-[#FEF9EF] border-b-2 border-[#151515] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF5B2E]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
              State Transition Audit Log ({history.length})
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#5B403A]">
            IMMUTABLE RECORDS
          </span>
        </div>

        <div className="divide-y border-t border-[#151515]/20 max-h-60 overflow-y-auto">
          {history.map((entry, index) => (
            <div key={index} className="p-3 flex items-start justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[10px] bg-[#151515] text-white px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                  <StatusBadge status={entry.status} />
                </div>
                <p className="font-sans text-xs text-[#151515] font-medium pt-0.5">
                  {entry.note || `Transitioned to ${entry.status}`}
                </p>
              </div>

              <span className="text-[11px] text-[#5B403A] whitespace-nowrap font-bold shrink-0">
                {entry.changedAt ? new Date(entry.changedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }) : "Timestamp logged"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
