import { API_ENDPOINTS } from "@/constants/api";
import { authFetch } from "@/lib/auth/session";
import { User } from "@/types/user";

/**
 * Server fetcher: Get logged-in user profile (Universal - R26)
 */
export async function getMyProfile(): Promise<User | null> {
  try {
    const res = await authFetch(API_ENDPOINTS.USERS.GET_PROFILE, {
      cache: "no-store", // Dashboard real-time live data
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}