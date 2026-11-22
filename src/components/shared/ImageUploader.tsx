"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UploadCloud, Loader2, X } from "lucide-react";
import { uploadImageAction } from "@/actions/upload";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label = "Profile Photo",
  disabled = false,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Secure Next.js Server Action call (Zero API key exposed in browser)
      const res = await uploadImageAction(formData);

      if (res.success && res.url) {
        onChange(res.url);
        toast.success("Photo uploaded!");
      } else {
        toast.error(res.error || "Upload failed");
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
      <div className="flex items-center justify-between p-2.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515]">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded border-2 border-[#151515] overflow-hidden bg-[#FEF9EF]">
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              sizes="36px"
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="font-mono text-xs font-semibold text-[#151515]">Photo Uploaded</span>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("")}
          className="p-1 border border-[#151515] bg-[#FFDAD6] hover:bg-[#BA1A1A] hover:text-white rounded transition-colors cursor-pointer"
          title="Remove photo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Label with balanced softness */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-medium tracking-wide text-[#7A5B53] uppercase">
          {label}
        </span>
        <span className="font-mono text-[9px] text-[#8F7068] lowercase">
          (optional)
        </span>
      </div>

      {/* Upload button with soft icon and text */}
      <label
        className={`border-2 border-dashed border-[#151515]/50 hover:border-[#151515] bg-white rounded-[6px] p-2.5 text-center cursor-pointer hover:bg-[#F8F3E9] flex items-center justify-center gap-2 transition-all ${
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
            <span className="font-mono text-xs font-medium text-[#7A5B53]">Uploading...</span>
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4 text-[#7A5B53]" />
            <span className="font-mono text-xs font-medium text-[#7A5B53]">
              Click to upload photo
            </span>
          </>
        )}
      </label>
    </div>
  );
}