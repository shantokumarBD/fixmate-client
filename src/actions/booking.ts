"use server";

import { authFetch } from "@/lib/auth/session";
import { API_ENDPOINTS } from "@/constants/api";
import { CreateBookingInput } from "@/types/booking";

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