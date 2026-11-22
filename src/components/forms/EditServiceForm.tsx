"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Service } from "@/types/service";
import { updateServiceAction } from "@/actions/service";
import { SERVICE_CATEGORIES, SERVICE_MODES, ServiceCategory } from "@/constants/roles";
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
  AlertTriangle,
  Save,
} from "lucide-react";

interface EditServiceFormProps {
  service: Service;
}

export function EditServiceForm({ service }: EditServiceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [imageUrl, setImageUrl] = useState(service.image || "");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(
    service.category || SERVICE_CATEGORIES[0]
  );
  const [selectedMode, setSelectedMode] = useState<"Home Visit" | "Shop Drop-off">(
    service.serviceMode || "Home Visit"
  );

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
      const res = await updateServiceAction(service._id, {
        title,
        category: selectedCategory,
        basePrice,
        estimatedDuration,
        serviceMode: selectedMode,
        serviceArea,
        image: imageUrl || service.image,
        description,
      });

      if (res.success) {
        toast.success(res.message || "Service updated successfully!");
        router.push(ROUTES.TECHNICIAN.MY_SERVICES);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update service");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-[#151515] shadow-[6px_6px_0px_#151515] rounded-[12px] p-6 sm:p-8 space-y-6"
    >
      {/* Moderation Re-approval Notice (PDF Requirement) */}
      <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-[8px] p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
        <div className="font-mono text-xs text-[#92400E] leading-relaxed">
          <strong className="font-bold uppercase block mb-0.5">
            MODERATION PROTOCOL // NOTICE
          </strong>
          Modifying this repair service will automatically reset its status to{" "}
          <span className="font-bold underline">PENDING</span> for administrative review before it appears in public catalog searches.
        </div>
      </div>

      {/* 1. Service Title */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-2">
          Service Title *
        </label>
        <div className="relative">
          <Wrench className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="title"
            defaultValue={service.title}
            required
            placeholder="e.g., iPhone Screen Replacement"
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
          />
        </div>
      </div>

      {/* 2. Category & Service Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-2">
            Appliance Category *
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
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
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-2">
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
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-2">
            Base Inspection Quote ($ USD) *
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              name="basePrice"
              defaultValue={service.basePrice}
              min="5"
              step="1"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-2">
            Estimated Duration *
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="estimatedDuration"
              defaultValue={service.estimatedDuration}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
            />
          </div>
        </div>
      </div>

      {/* 4. Service Area & Photo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-2">
            Service Coverage Area *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="serviceArea"
              defaultValue={service.serviceArea}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-2">
            Service Thumbnail Image (ImgBB)
          </label>
          <ImageUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            label="Replace Service Photo"
          />
        </div>
      </div>

      {/* 5. Description */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#151515] mb-2">
          Technical Problem Scope & Diagnosis Description *
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-[#5B403A] absolute left-3.5 top-3" />
          <textarea
            name="description"
            defaultValue={service.description}
            rows={4}
            required
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-sans text-sm text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E]"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-6 bg-[#151515] text-white border-2 border-[#151515] shadow-[4px_4px_0px_#FF5B2E] font-heading font-black text-sm uppercase tracking-wider hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-[8px] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Service...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#FCD03D]" />
              <span>Save Changes & Resubmit</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}