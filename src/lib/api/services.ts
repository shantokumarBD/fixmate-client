import { API_ENDPOINTS } from "@/constants/api";
import { Service, ServiceDetail } from "@/types/service";
import { authFetch } from "@/lib/auth/session";

/**
 * Server fetcher: Top 6 featured services for homepage (bounded by 6s timeout)
 */
export async function getFeaturedServices(limit: number = 6): Promise<Service[]> {
  try {
    const res = await fetch(`${API_ENDPOINTS.SERVICES.GET_ALL}?limit=${limit}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const data = await res.json().catch(() => []);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Server fetcher: Real-time service counts per category (bounded by 6s timeout)
 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const res = await fetch(API_ENDPOINTS.SERVICES.GET_ALL, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return {};
    const services: Service[] = await res.json().catch(() => []);

    const counts: Record<string, number> = {};
    if (Array.isArray(services)) {
      services.forEach((s) => {
        if (s.category) counts[s.category] = (counts[s.category] || 0) + 1;
      });
    }
    return counts;
  } catch {
    return {};
  }
}

/**
 * Server fetcher: Multi-criteria filtered services for Browse Services page (bounded by 6s timeout)
 */
export async function fetchFilteredServices(filters: {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
}): Promise<Service[]> {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.serviceMode) params.set("serviceMode", filters.serviceMode);
    if (filters.sort) params.set("sort", filters.sort);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.SERVICES.GET_ALL}?${queryString}`
      : API_ENDPOINTS.SERVICES.GET_ALL;

    const res = await fetch(url, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return [];
    const data = await res.json().catch(() => []);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch filtered services:", error);
    return [];
  }
}

/**
 * Server fetcher: Single service details
 * - Validates strict 24-character hexadecimal MongoDB ObjectId regex
 * - Returns null ONLY on authentic 404 Not Found or invalid hex format
 * - Throws on 5xx or cold-start network drop to prevent false 404 pages
 */
export async function getServiceById(id: string): Promise<ServiceDetail | null> {
  // Security check: validate exact 24-character hexadecimal MongoDB ObjectId
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) return null;

  try {
    const res = await fetch(`${API_ENDPOINTS.SERVICES.GET_ALL}/${id}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    });

    // Authentic 404: Service genuinely does not exist in database
    if (res.status === 404) return null;

    if (!res.ok) {
      // 5xx or gateway error: Server is waking up, not a 404!
      throw new Error("Service details delayed: dispatch gateway is reconnecting. Please retry.");
    }

    const data = await res.json().catch(() => null);
    return data && data._id ? data : null;
  } catch (error: unknown) {
    if ((error as Error)?.message?.includes("delayed")) throw error;
    console.error("Failed to fetch service details:", error);
    // Network/timeout error: throw so error boundary handles reconnect instead of false 404
    throw new Error("Service details delayed: dispatch gateway is reconnecting. Please retry.");
  }
}

/**
 * Server fetcher: Get all services authored by the logged-in technician 
 */
export async function getMyTechnicianServices(): Promise<Service[]> {
  try {
    const res = await authFetch(API_ENDPOINTS.SERVICES.GET_MY, {
      cache: "no-store", // Dashboard real-time live data
    });
    if (!res.ok) return [];
    const data = await res.json().catch(() => []);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}