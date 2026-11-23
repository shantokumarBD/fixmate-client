"use server";

import { revalidatePath } from "next/cache";
import { authFetch } from "@/lib/auth/session";
import { API_ENDPOINTS } from "@/constants/api";

export interface SubmitReviewInput {
  bookingId: string;
  rating: number;
  comment: string;
}

/**
 * Server Action: Customer submits verified review for a completed & paid booking
 */
export async function submitReviewAction(input: SubmitReviewInput) {
  try {
    const res = await authFetch(API_ENDPOINTS.REVIEWS.POST, {
      method: "POST",
      body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error:
          data.message ||
          (res.status === 403
            ? "You are not authorized to review this booking"
            : res.status === 404
            ? "Service or booking record not found"
            : "Failed to submit review"),
      };
    }

    // Revalidate customer dashboard and public services
    revalidatePath("/dashboard/customer/bookings");
    revalidatePath("/dashboard/customer");
    revalidatePath("/services");

    return {
      success: true,
      message: data.message || "Review submitted successfully! Thank you for your feedback.",
      review: data.review,
      serviceRating: data.serviceRating,
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
        ? "Network connection issue. Please retry."
        : err.message || "Failed to submit review",
    };
  }
}
