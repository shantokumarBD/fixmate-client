import { API_ENDPOINTS } from "@/constants/api";
import { authFetch } from "@/lib/auth/session";
import { Booking } from "@/types/booking";
import { User } from "@/types/user";

export interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  totalServices: number;
  pendingServices: number;
  totalBookings: number;
  totalRevenue: number;
}

/**
 * Fetch platform-wide statistics for Admin Overview (R21)
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const res = await authFetch(API_ENDPOINTS.ADMIN.GET_STATS, {
      cache: "no-store", // Live real-time telemetry
    });

    if (!res.ok) {
      return {
        totalUsers: 0,
        totalTechnicians: 0,
        totalServices: 0,
        pendingServices: 0,
        totalBookings: 0,
        totalRevenue: 0,
      };
    }

    const data = await res.json();
    return data;
  } catch {
    return {
      totalUsers: 0,
      totalTechnicians: 0,
      totalServices: 0,
      pendingServices: 0,
      totalBookings: 0,
      totalRevenue: 0,
    };
  }
}

/**
 * Fetch recent platform bookings for Admin Overview
 */
export async function getAllBookingsForAdmin(): Promise<Booking[]> {
  try {
    const res = await authFetch(API_ENDPOINTS.ADMIN.GET_BOOKINGS, {
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
 * Fetch all registered users for Admin User Management (R22)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const res = await authFetch(API_ENDPOINTS.ADMIN.GET_USERS, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}