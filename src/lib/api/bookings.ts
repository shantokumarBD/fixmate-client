import { API_ENDPOINTS } from "@/constants/api";
import { authFetch } from "@/lib/auth/session";
import { Booking } from "@/types/booking";

/**
 * Server fetcher: Get all bookings created by the logged-in customer
 */
export async function getMyBookings(): Promise<Booking[]> {
  try {
    const res = await authFetch(API_ENDPOINTS.BOOKINGS.GET_MY, {
      cache: "no-store", // Dashboard displays real-time live data
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}