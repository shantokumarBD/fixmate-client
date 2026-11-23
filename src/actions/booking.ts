"use server";

import { revalidatePath } from "next/cache";
import { authFetch } from "@/lib/auth/session";
import { API_ENDPOINTS } from "@/constants/api";
import { CreateBookingInput } from "@/types/booking";

/**
 * Server Action: Create a new repair service booking
 */
export async function createBookingAction(input: CreateBookingInput) {
  try {
    const res = await authFetch(API_ENDPOINTS.BOOKINGS.POST, {
      method: "POST",
      body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to submit repair request",
      };
    }

    // Revalidate customer dashboard views
    revalidatePath("/dashboard/customer");
    revalidatePath("/dashboard/customer/bookings");

    return {
      success: true,
      bookingId: data.bookingId,
      message: data.message || "Booking requested successfully!",
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
 * Server Action: Cancel a repair booking (Only valid when status is 'requested')
 */
export async function cancelBookingAction(bookingId: string, cancellationReason?: string) {
  try {
    const res = await authFetch(API_ENDPOINTS.BOOKINGS.PATCH_CANCEL(bookingId), {
      method: "PATCH",
      body: cancellationReason ? JSON.stringify({ cancellationReason }) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to cancel repair booking",
      };
    }

    // Revalidate paths for instant client sync
    revalidatePath("/dashboard/customer/bookings");
    revalidatePath("/dashboard/customer");

    return {
      success: true,
      message: data.message || "Booking cancelled successfully",
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
 * Server Action: Technician updates booking status (Challenge 3 State Machine Pipeline)
 * Status transitions: requested -> accepted/rejected -> in-progress -> completed
 */
export async function updateBookingStatusAction(
  bookingId: string,
  status: string,
  finalAmount?: number,
  note?: string
) {
  try {
    const payload: { status: string; finalAmount?: number; note?: string } = { status };
    if (finalAmount !== undefined) {
      payload.finalAmount = finalAmount;
    }
    if (note && note.trim() !== "") {
      payload.note = note.trim();
    }

    const res = await authFetch(API_ENDPOINTS.BOOKINGS.PATCH_STATUS(bookingId), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.message || `Failed to update status to ${status}`,
      };
    }

    // Revalidate all technician and customer dashboards
    revalidatePath("/dashboard/technician/requests");
    revalidatePath("/dashboard/technician");
    revalidatePath("/dashboard/customer/bookings");
    revalidatePath("/dashboard/customer");

    return {
      success: true,
      message: data.message || `Booking status updated to ${status}`,
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