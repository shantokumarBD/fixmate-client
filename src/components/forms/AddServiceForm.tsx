"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createServiceAction } from "@/actions/service";
import { SERVICE_CATEGORIES, SERVICE_MODES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { ImageUploader } from "@/components/shared/ImageUploader";
import {
  Wrench,
  DollarSign,
  Clock,
  MapPin,
  FileText,
  Tag,
  Loader2,
  Sparkles,
} from "lucide-react";

export function AddServiceForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [imageUrl, setImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(SERVICE_CATEGORIES[0]);
  const [selectedMode, setSelectedMode] = useState<"Home Visit" | "Shop Drop-off">("Home Visit");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const title = form.get("title")?.toString().trim() || "";
    const basePrice = Number(form.get("basePrice")) || 0;
    const estimatedDuration = form.get("estimatedDuration")?.toString().trim() || "1-2 Hours";
    const serviceArea = form.get("serviceArea")?.toString().trim() || "Dhaka Metropolitan Area";
    const description = form.get("description")?.toString().trim() || "";

    if (!title || title.length < 5) {
      toast.error("Service title must be at least 5 characters long");
      return;
    }

    if (basePrice <= 0) {
      toast.error("Base price must be greater than $0");
      return;
    }

    if (!description || description.length < 20) {
      toast.error("Description must be at least 20 characters long");
      return;
    }

    startTransition(async () => {
      const res = await createServiceAction({
        title,
        category: selectedCategory,
        basePrice,
        estimatedDuration,
        serviceMode: selectedMode,
        serviceArea,
        image: imageUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        description,
      });

      if (res.success) {
        toast.success(res.message || "Service submitted for admin moderation!");
        router.push(ROUTES.TECHNICIAN.MY_SERVICES);
      } else {
        toast.error(res.error || "Failed to create service");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] p-5 sm:p-7 space-y-5"
    >
      {/* 1. Service Title */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
          Service Title *
        </label>
        <div className="relative">
          <Wrench className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., iPhone Motherboard Chip Level Diagnostic & Repair"
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
          />
        </div>
      </div>

      {/* 2. Category & Service Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
            Appliance Category *
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] appearance-none cursor-pointer"
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
            Dispatch Mode *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className={`py-2 px-3 border-2 border-[#151515] rounded-[6px] font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                  selectedMode === mode
                    ? "bg-[#151515] text-white shadow-[2px_2px_0px_#FF5B2E]"
                    : "bg-white text-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#FEF9EF]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Base Price & Estimated Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
            Base Inspection Quote ($ USD) *
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              name="basePrice"
              min="5"
              step="1"
              required
              placeholder="e.g., 35"
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
            />
          </div>
          <span className="font-mono text-[10px] text-[#5B403A] mt-1 block">
            Covers initial disassembly & OEM diagnostics.
          </span>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
            Estimated Duration *
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="estimatedDuration"
              required
              placeholder="e.g., 2-3 Hours or Same Day"
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
            />
          </div>
        </div>
      </div>

      {/* 4. Service Area & Photo Upload */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
            Service Coverage Area *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="serviceArea"
              required
              placeholder="e.g., Dhanmondi, Gulshan & Banani"
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
            Service Thumbnail Image (ImgBB)
          </label>
          <ImageUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            label="Upload Service Photo"
          />
        </div>
      </div>

      {/* 5. Service Description */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-1.5">
          Technical Problem Scope & Diagnosis Description *
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-3" />
          <textarea
            name="description"
            rows={3}
            required
            placeholder="Explain what repair operations are covered, equipment used, and customer guarantees..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
          ></textarea>
        </div>
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
              <span>Publishing to Moderation Queue...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Submit Service for Moderation</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}