"use server";

import { revalidatePath } from "next/cache";
import { authFetch } from "@/lib/auth/session";
import { API_ENDPOINTS } from "@/constants/api";

export interface CreateServiceInput {
  title: string;
  category: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  image?: string;
  description: string;
}

/**
 * Server Action: Create a new repair service (R09)
 */
export async function createServiceAction(input: CreateServiceInput) {
  try {
    const res = await authFetch(API_ENDPOINTS.SERVICES.POST, {
      method: "POST",
      body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to create service",
      };
    }

    revalidatePath("/dashboard/technician/my-services");
    revalidatePath("/services");

    return {
      success: true,
      serviceId: data.insertedId,
      message: "Service submitted for admin moderation!",
    };
  } catch (error: unknown) {
    const err = error as Error;
    const isNetwork =
      err.message?.includes("fetch failed") ||
      err.message?.includes("ECONNREFUSED") ||
      err.message?.includes("Failed to communicate");
    return {
      success: false,
      error: isNetwork
        ? "Network error. Please try again later."
        : err.message || "Network error. Please try again later.",
    };
  }
}

/**
 * Server Action: Toggle service availability without resetting approval (Challenge 1)
 */
export async function toggleAvailabilityAction(serviceId: string, isAvailable: boolean) {
  try {
    const res = await authFetch(API_ENDPOINTS.SERVICES.PATCH_AVAILABILITY(serviceId), {
      method: "PATCH",
      body: JSON.stringify({ isAvailable }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to update availability",
      };
    }

    revalidatePath("/dashboard/technician/my-services");
    revalidatePath("/services");

    return {
      success: true,
      isAvailable: data.isAvailable,
      message: data.message || "Availability status updated",
    };
  } catch (error: unknown) {
    const err = error as Error;
    const isNetwork =
      err.message?.includes("fetch failed") ||
      err.message?.includes("ECONNREFUSED") ||
      err.message?.includes("Failed to communicate");
    return {
      success: false,
      error: isNetwork
        ? "Network error. Please try again later."
        : err.message || "Network error. Please try again later.",
    };
  }
}

/**
 * Server Action: Update existing service (R11: Edits require re-approval)
 */
export async function updateServiceAction(
  serviceId: string,
  input: CreateServiceInput
) {
  try {
    const res = await authFetch(API_ENDPOINTS.SERVICES.PATCH(serviceId), {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to update service",
      };
    }
    revalidatePath("/dashboard/technician/my-services");
    revalidatePath("/services");
    return {
      success: true,
      message: "Service updated! Resubmitted for admin moderation.",
    };
  } catch (error: unknown) {
    const err = error as Error;
    const isNetwork =
      err.message?.includes("fetch failed") ||
      err.message?.includes("ECONNREFUSED") ||
      err.message?.includes("Failed to communicate");
    return {
      success: false,
      error: isNetwork
        ? "Network error. Please try again later."
        : err.message || "Network error. Please try again later.",
    };
  }
}

/**
 * Server Action: Delete technician's own service
 */
export async function deleteServiceAction(serviceId: string) {
  try {
    const res = await authFetch(API_ENDPOINTS.SERVICES.DELETE(serviceId), {
      method: "DELETE",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to delete service",
      };
    }

    revalidatePath("/dashboard/technician/my-services");
    revalidatePath("/services");

    return {
      success: true,
      message: data.message || "Service deleted successfully",
    };
  } catch (error: unknown) {
    const err = error as Error;
    const isNetwork =
      err.message?.includes("fetch failed") ||
      err.message?.includes("ECONNREFUSED") ||
      err.message?.includes("Failed to communicate");
    return {
      success: false,
      error: isNetwork
        ? "Network error. Please try again later."
        : err.message || "Network error. Please try again later.",
    };
  }
}