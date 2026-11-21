import { API_ENDPOINTS } from "@/constants/api";
import { Service } from "@/types/service";

/**
 * Server-only fetcher for public featured services
 * Cached for 60 seconds (Next.js 16 ISR Compliant)
 */
export async function getFeaturedServices(limit: number = 6): Promise<Service[]> {
  try {
    const res = await fetch(`${API_ENDPOINTS.SERVICES.GET_ALL}?limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Backend returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Backend fetch error:", error);
    return [];
  }
}