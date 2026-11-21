import { API_ENDPOINTS } from "@/constants/api";
import { authFetch } from "@/lib/auth/session";
import { Service } from "@/types/service";

/**
 * Server fetcher: Get all services authored by the logged-in technician (R10)
 */
export async function getMyTechnicianServices(): Promise<Service[]> {
  try {
    const res = await authFetch(API_ENDPOINTS.SERVICES.GET_MY, {
      cache: "no-store", // Dashboard real-time live data
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}