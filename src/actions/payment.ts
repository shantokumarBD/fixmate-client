"use server";

import { redirect } from "next/navigation";
import { authFetch } from "@/lib/auth/session";
import { API_ENDPOINTS } from "@/constants/api";

export async function createCheckoutSessionAction(bookingId: string) {
  let checkoutUrl = "";

  try {
    const res = await authFetch(API_ENDPOINTS.PAYMENTS.POST_CHECKOUT, {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
      return {
        success: false,
        error: data.message || "Failed to initiate Stripe payment",
      };
    }

    checkoutUrl = data.url;
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: err.message || "Network error. Please try again later.",
    };
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}