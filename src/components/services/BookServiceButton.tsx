"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, AlertCircle } from "lucide-react";
import { ServiceDetail } from "@/types/service";
import { useSession } from "@/lib/auth/auth-client";
import { BookingModal } from "./BookingModal";
import { ROUTES } from "@/constants/routes";

interface BookServiceButtonProps {
  service: ServiceDetail;
}

export function BookServiceButton({ service }: BookServiceButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleWarning, setRoleWarning] = useState("");

  const handleBookClick = () => {
    if (isPending) return;

    setRoleWarning("");

    if (!session?.user) {
      router.push(`${ROUTES.SIGN_IN}?callbackUrl=/services/${service._id}`);
      return;
    }

    const userRole = ((session.user as Record<string, unknown>).role as string || "customer").toLowerCase();

    if (userRole === "technician" || userRole === "admin") {
      setRoleWarning("Technicians and Admins cannot book repairs. Please log in with a Customer account.");
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleBookClick}
        type="button"
        className="w-full py-3 px-4 bg-[#FF5B2E] text-[#151515] border-2 border-[#151515] rounded-[8px] font-heading font-extrabold text-sm uppercase tracking-wide shadow-[3px_3px_0px_#151515] hover:shadow-[1px_1px_0px_#151515] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
      >
        <Sparkles className="w-4 h-4 text-[#151515]" />
        <span>Book Repair Now</span>
      </button>

      {/* Clean Error Alert with Lucide Icon (Zero Mojibake) */}
      {roleWarning && (
        <div className="p-2.5 bg-[#FFDAD6] border-2 border-[#BA1A1A] rounded-[6px] text-xs font-mono text-[#BA1A1A] font-semibold flex items-center gap-2 leading-tight">
          <AlertCircle className="w-4 h-4 text-[#BA1A1A] shrink-0" />
          <span>{roleWarning}</span>
        </div>
      )}

      {/* Render Booking Modal */}
      <BookingModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerPhone={((session?.user as Record<string, unknown>)?.phone as string) || ""}
        customerAddress={((session?.user as Record<string, unknown>)?.area as string) || ""}
      />
    </div>
  );
}