"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
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
    // 0. Prevent premature redirect if session is still resolving
    if (isPending) return;

    setRoleWarning("");

    // 1. Unauthenticated -> Redirect to sign in with returnUrl
    if (!session?.user) {
      router.push(`${ROUTES.SIGN_IN}?returnUrl=/services/${service._id}`);
      return;
    }

    const userRole = ((session.user as Record<string, unknown>).role as string || "customer").toLowerCase();

    // 2. Role Restriction: Only customers can book repairs
    if (userRole === "technician" || userRole === "admin") {
      setRoleWarning("Technicians and Admins cannot book repairs. Please log in with a Customer account.");
      return;
    }

    // 3. Open Booking Modal
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

      {roleWarning && (
        <div className="p-2.5 bg-[#FFDAD6] border-2 border-[#BA1A1A] rounded-[6px] text-[11px] font-mono text-[#BA1A1A] font-medium leading-tight">
          ⚠️ {roleWarning}
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