"use server";

import { revalidatePath } from "next/cache";
import { authFetch } from "@/lib/auth/session";
import { API_ENDPOINTS } from "@/constants/api";

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  area?: string;
  bio?: string;
  image?: string;
}

/**
 * Server Action: Update user profile credentials & details (R26)
 */
export async function updateProfileAction(input: UpdateProfileInput) {
  try {
    const res = await authFetch(API_ENDPOINTS.USERS.PATCH_PROFILE, {
      method: "PATCH",
      body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to update profile",
      };
    }

    // Revalidate profile, dashboard layouts, and root navbar layout
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard", "layout");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: data.message || "Profile updated successfully!",
      user: data.user,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: err.message || "Network error. Please try again later.",
    };
  }
}