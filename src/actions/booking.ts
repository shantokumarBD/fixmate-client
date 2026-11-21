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

    const data = await res.json();

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
    return {
      success: false,
      error: err.message || "Network error. Please try again later.",
    };
  }
}

/**
 * Server Action: Cancel a repair booking (Only valid when status is 'requested')
 */
export async function cancelBookingAction(bookingId: string) {
  try {
    const res = await authFetch(API_ENDPOINTS.BOOKINGS.PATCH_CANCEL(bookingId), {
      method: "PATCH",
    });

    const data = await res.json();

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
    return {
      success: false,
      error: err.message || "Network error. Please try again later.",
    };
  }
}