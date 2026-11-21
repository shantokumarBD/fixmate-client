import { API_ENDPOINTS } from "@/constants/api";
import { authFetch } from "@/lib/auth/session";
import { Payment } from "@/types/payment";

/**
 * Server fetcher: Get all settled payment records for logged-in customer
 */
export async function getMyPayments(): Promise<Payment[]> {
  try {
    const res = await authFetch(API_ENDPOINTS.PAYMENTS.GET_MY, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Server fetcher: Verify Stripe payment session on success redirect
 */
export async function verifyPaymentSession(sessionId: string): Promise<{
  success: boolean;
  payment?: Payment;
  message?: string;
}> {
  try {
    const res = await authFetch(
      `${API_ENDPOINTS.PAYMENTS.GET_VERIFY}?session_id=${encodeURIComponent(sessionId)}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to verify payment session",
      };
    }

    return {
      success: true,
      payment: data.payment,
      message: data.message,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      message: error.message || "Verification request failed",
    };
  }
}