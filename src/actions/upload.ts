"use server";

import { IMGBB_UPLOAD_URL } from "@/constants/api";

export async function uploadImageAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const file = formData.get("image");
    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    // Server-side environment key (Client network tab will never see this)
    const apiKey = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "Server configuration error: IMGBB_API_KEY is missing",
      };
    }

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const res = await fetch(`${IMGBB_UPLOAD_URL}?key=${apiKey}`, {
      method: "POST",
      body: uploadFormData,
    });

    const data = await res.json();

    if (data.success && data.data?.url) {
      return {
        success: true,
        url: data.data.url,
      };
    }

    return {
      success: false,
      error: data.error?.message || "Failed to upload image to ImgBB",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error during image upload";
    return {
      success: false,
      error: message,
    };
  }
}