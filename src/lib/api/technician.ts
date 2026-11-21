import { API_ENDPOINTS } from "@/constants/api";
import { authFetch } from "@/lib/auth/session";
import { Service } from "@/types/service";
import { Booking } from "@/types/booking";

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

/**
 * Server fetcher: Get a single service owned by the logged-in technician
 */
export async function getTechnicianServiceById(serviceId: string): Promise<Service | null> {
  const myServices = await getMyTechnicianServices();
  return myServices.find((s) => s._id === serviceId) || null;
}

/**
 * Server fetcher: Get all bookings assigned to the logged-in technician (R12, R13)
 */
export async function getTechnicianBookings(): Promise<Booking[]> {
  try {
    const res = await authFetch(API_ENDPOINTS.BOOKINGS.GET_TECHNICIAN, {
      cache: "no-store", // Dashboard real-time live data
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}