"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import { updateProfileAction } from "@/actions/user";
import { ImageUploader } from "@/components/shared/ImageUploader";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  FileText,
  Lock,
  ShieldCheck,
  Sparkles,
  Loader2,
  Shield,
  Wrench,
  CheckCircle2,
} from "lucide-react";

interface ProfileSettingsFormProps {
  initialUser: User;
}

export function ProfileSettingsForm({ initialUser }: ProfileSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialUser.name || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [area, setArea] = useState(initialUser.area || "");
  const [bio, setBio] = useState(initialUser.bio || "");
  const [imageUrl, setImageUrl] = useState(initialUser.image || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    startTransition(async () => {
      const res = await updateProfileAction({
        name: name.trim(),
        phone: phone.trim(),
        area: area.trim(),
        bio: bio.trim(),
        image: imageUrl.trim(),
      });

      if (res.success) {
        toast.success(res.message || "Profile updated successfully!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    });
  };

  const roleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-[#FF5B2E] text-white border-[#151515]";
      case "technician":
        return "bg-[#FCD03D] text-[#151515] border-[#151515]";
      default:
        return "bg-[#DBEAFE] text-[#1E40AF] border-[#93C5FD]";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ================= LEFT COLUMN: EDITABLE PROFILE FORM (8 COLS) ================= */}
      <div className="lg:col-span-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-5 sm:p-7 space-y-5"
        >
          {/* Section Heading */}
          <div className="flex items-center gap-2 pb-3 border-b-2 border-[#151515]">
            <span className="w-3 h-3 bg-[#FF5B2E] border-2 border-[#151515]"></span>
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#151515]">
              Personal & Dispatch Information
            </h2>
          </div>

          {/* 1. Name & Verified Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tanvir Ahmed"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
                  Email Address
                </label>
                <span className="font-mono text-[10px] text-[#16A34A] flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={initialUser.email}
                  className="w-full pl-10 pr-9 py-2.5 bg-[#F2EDE3] border-2 border-[#151515] rounded-[6px] font-mono text-sm text-[#5B403A] cursor-not-allowed select-none"
                />
                <Lock className="w-3.5 h-3.5 text-[#5B403A] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* 2. Contact Phone & Service Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +880 1700-000000"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
                Service Area / Home Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., Dhanmondi, Dhaka"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
                />
              </div>
            </div>
          </div>

          {/* 3. Professional Bio / Notes */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
              Professional Bio & Experience
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-3" />
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your diagnostic experience, equipment specialities, or service guarantees..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
              ></textarea>
            </div>
          </div>

          {/* 4. Profile Picture Uploader */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
              Profile Avatar (ImgBB)
            </label>
            <ImageUploader
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              label="Upload Profile Photo"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-6 bg-[#FF5B2E] text-white border-2 border-[#151515] shadow-[3px_3px_0px_#000000] font-heading font-black text-sm uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-[8px] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ================= RIGHT COLUMN: IDENTITY & SECURITY SUMMARY (4 COLS) ================= */}
      <div className="lg:col-span-4 space-y-5">
        {/* Identity Card */}
        <div className="bg-[#FEF9EF] border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515]">
          <div className="flex flex-col items-center text-center pb-4 border-b-2 border-[#151515]">
            <div className="w-20 h-20 rounded-full bg-[#FF5B2E] border-2 border-[#151515] overflow-hidden relative flex items-center justify-center text-white font-extrabold text-2xl uppercase shadow-[2px_2px_0px_#151515] mb-3">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name || "User"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span>{name ? name.charAt(0) : "U"}</span>
              )}
            </div>

            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              {name || "FixMate Member"}
            </h3>
            <p className="font-mono text-xs text-[#5B403A] truncate max-w-[220px]">
              {initialUser.email}
            </p>

            <div className="mt-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] font-mono text-xs font-bold uppercase border ${roleBadgeStyle(
                  initialUser.role
                )}`}
              >
                {initialUser.role === "admin" && <Shield className="w-3.5 h-3.5" />}
                {initialUser.role === "technician" && <Wrench className="w-3.5 h-3.5" />}
                {initialUser.role === "customer" && <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{initialUser.role} ACCESS</span>
              </span>
            </div>
          </div>

          <div className="pt-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[#5B403A]">
              <span>ACCOUNT ID:</span>
              <span className="font-bold text-[#151515]">
                #{(initialUser._id || initialUser.id || "USR").slice(-6).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-[#5B403A]">
              <span>STATUS:</span>
              <span className="font-bold text-[#16A34A]">AUTHENTICATED</span>
            </div>
          </div>
        </div>

        {/* Security & RBAC Policy Card */}
        <div className="bg-[#151515] text-[#F5F0E6] border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#FF5B2E]">
          <span className="font-mono text-[11px] font-bold uppercase text-[#FCD03D] block mb-2">
            ACCOUNT SECURITY NOTICE
          </span>
          <p className="font-sans text-xs text-[#DEDAD0] leading-relaxed">
            Your registered <strong>email address</strong> and <strong>system role</strong> are protected against unauthorized modification. Role changes require administrator approval in accordance with security protocols.
          </p>
        </div>
      </div>
    </div>
  );
}