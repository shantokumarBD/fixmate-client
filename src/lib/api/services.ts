import { API_ENDPOINTS } from "@/constants/api";
import { Service, ServiceDetail, PaginatedServicesResponse } from "@/types/service";
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
    const data = await res.json().catch(() => null);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.services)) return data.services;
    return [];
  } catch {
    return [];
  }
}

/**
 * Server fetcher: Real-time service counts per category across all catalog items (bounded by 6s timeout)
 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${API_ENDPOINTS.SERVICES.GET_ALL}?all=true`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return {};
    const data = await res.json().catch(() => null);
    const servicesList: Service[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.services)
      ? data.services
      : [];

    const counts: Record<string, number> = {};
    servicesList.forEach((s) => {
      if (s.category) counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  } catch {
    return {};
  }
}

/**
 * Server fetcher: Multi-criteria filtered services with server-side pagination for Browse Services page (bounded by 6s timeout)
 */
export async function fetchFilteredServices(filters: {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
  page?: string | number;
  limit?: string | number;
}): Promise<PaginatedServicesResponse> {
  const fallback: PaginatedServicesResponse = {
    services: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 6,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  try {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.serviceMode) params.set("serviceMode", filters.serviceMode);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.SERVICES.GET_ALL}?${queryString}`
      : API_ENDPOINTS.SERVICES.GET_ALL;

    const res = await fetch(url, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return fallback;
    const data = await res.json().catch(() => null);

    if (data && Array.isArray(data.services) && data.pagination) {
      return {
        services: data.services,
        pagination: {
          total: Number(data.pagination.total) || 0,
          page: Number(data.pagination.page) || 1,
          limit: Number(data.pagination.limit) || 6,
          totalPages: Number(data.pagination.totalPages) || 0,
          hasNextPage: Boolean(data.pagination.hasNextPage),
          hasPrevPage: Boolean(data.pagination.hasPrevPage),
        },
      };
    }

    if (Array.isArray(data)) {
      return {
        services: data,
        pagination: {
          total: data.length,
          page: 1,
          limit: data.length || 6,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    return fallback;
  } catch (error) {
    console.error("Failed to fetch filtered services:", error);
    return fallback;
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