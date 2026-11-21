import { API_ENDPOINTS } from "@/constants/api";
import { Service, ServiceDetail } from "@/types/service";

/**
 * Server fetcher: Top 6 featured services for homepage
 */
export async function getFeaturedServices(limit: number = 6): Promise<Service[]> {
  try {
    const res = await fetch(`${API_ENDPOINTS.SERVICES.GET_ALL}?limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

/**
 * Server fetcher: Real-time service counts per category directly from MongoDB
 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const res = await fetch(API_ENDPOINTS.SERVICES.GET_ALL, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return {};
    const services: Service[] = await res.json();

    const counts: Record<string, number> = {};
    if (Array.isArray(services)) {
      services.forEach((s) => {
        if (s.category) counts[s.category] = (counts[s.category] || 0) + 1;
      });
    }
    return counts;
  } catch (error) {
    return {};
  }
}

/**
 * Server fetcher: Multi-criteria filtered services for Browse Services page 
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
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch filtered services:", error);
    return [];
  }
}

/**
 * Server fetcher: Single service details with technician profile summary (R07)
 */
export async function getServiceById(id: string): Promise<ServiceDetail | null> {
  try {
    // Security check: validate MongoDB ObjectId length
    if (!id || id.length !== 24) return null;

    const res = await fetch(`${API_ENDPOINTS.SERVICES.GET_ALL}/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data && data._id ? data : null;
  } catch (error) {
    console.error("Failed to fetch service details:", error);
    return null;
  }
}