"use server";

import { revalidatePath } from "next/cache";
import { authFetch } from "@/lib/auth/session";
import { API_ENDPOINTS } from "@/constants/api";

/**
 * Server Action: Update a user's role (Admin RBAC - R22)
 */
export async function updateUserRoleAction(userId: string, role: string) {
  try {
    const res = await authFetch(API_ENDPOINTS.ADMIN.PATCH_ROLE(userId), {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to update user role",
      };
    }

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin");

    return {
      success: true,
      message: data.message || `User role updated to ${role} successfully`,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: err.message || "Network error. Please try again later.",
    };
  }
}