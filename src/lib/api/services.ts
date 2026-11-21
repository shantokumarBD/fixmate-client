import { API_ENDPOINTS } from "@/constants/api";
import { Service } from "@/types/service";

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