"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UploadCloud, Loader2, X } from "lucide-react";
import { IMGBB_UPLOAD_URL } from "@/constants/api";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = "Upload Photo",
  disabled = false,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API key is missing");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${IMGBB_UPLOAD_URL}?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.data?.url) {
        onChange(data.data.url);
        toast.success("Photo uploaded!");
      } else {
        toast.error(data.error?.message || "Upload failed");
      }
    } catch {
      toast.error("Network error during upload");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  if (value) {
    return (
      <div className="flex items-center justify-between p-2.5 bg-white border-2 border-[#151515] rounded-[8px] shadow-[2px_2px_0px_#151515]">
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded border-2 border-[#151515] overflow-hidden bg-[#FEF9EF]">
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              sizes="40px"
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="font-mono text-xs font-bold text-[#151515]">Photo Uploaded</span>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("")}
          className="p-1 border border-[#151515] bg-[#FFDAD6] hover:bg-[#BA1A1A] hover:text-white rounded transition-colors"
          title="Remove photo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-xs font-bold text-[#151515] uppercase flex justify-between">
        <span>{label}</span>
        <span className="text-[10px] text-[#5B403A] font-normal lowercase">(optional)</span>
      </span>

      <label
        className={`border-2 border-dashed border-[#151515] bg-white rounded-[8px] p-3 text-center cursor-pointer hover:bg-[#F8F3E9] flex items-center justify-center gap-2 transition-all ${
          loading || disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={loading || disabled}
          className="hidden"
        />
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#FF5B2E]" />
            <span className="font-mono text-xs font-bold text-[#151515]">Uploading...</span>
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4 text-[#151515]" />
            <span className="font-mono text-xs font-bold text-[#151515]">Click to upload photo</span>
          </>
        )}
      </label>
    </div>
  );
}