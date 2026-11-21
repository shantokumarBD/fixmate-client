/**
 * FixMate Express REST API Endpoints
 * HTTP Action Verbs (GET, POST, PATCH, DELETE) for maximum clarity.
 */

// ImgBB Upload Endpoint
export const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";


export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Services
  SERVICES: {
    GET_ALL: `${API_BASE_URL}/api/services`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/services/${id}`,
    POST: `${API_BASE_URL}/api/services`,
    PATCH: (id: string) => `${API_BASE_URL}/api/services/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/services/${id}`,
    PATCH_AVAILABILITY: (id: string) =>
      `${API_BASE_URL}/api/services/${id}/availability`,
  },

  // Bookings (Customer & Technician)
  BOOKINGS: {
    POST: `${API_BASE_URL}/api/bookings`,
    GET_MY: `${API_BASE_URL}/api/bookings/my`,
    PATCH_CANCEL: (id: string) => `${API_BASE_URL}/api/bookings/${id}/cancel`,
    GET_TECHNICIAN: `${API_BASE_URL}/api/bookings/technician`,
    PATCH_STATUS: (id: string) => `${API_BASE_URL}/api/bookings/${id}/status`,
  },

  // Payments (Stripe Checkout & Settlement)
  PAYMENTS: {
    POST_CHECKOUT: `${API_BASE_URL}/api/payments/create-checkout-session`,
    GET_VERIFY: `${API_BASE_URL}/api/payments/verify`,
  },

  // Admin Protected
  ADMIN: {
    GET_STATS: `${API_BASE_URL}/api/admin/stats`,
    GET_USERS: `${API_BASE_URL}/api/admin/users`,
    PATCH_ROLE: (id: string) => `${API_BASE_URL}/api/admin/users/${id}/role`,
    GET_SERVICES: `${API_BASE_URL}/api/admin/services`,
    PATCH_APPROVAL: (id: string) =>
      `${API_BASE_URL}/api/admin/services/${id}/approval`,
    GET_BOOKINGS: `${API_BASE_URL}/api/admin/bookings`,
    GET_PAYMENTS: `${API_BASE_URL}/api/admin/payments`,
  },

  // User Profile
  USERS: {
    GET_PROFILE: `${API_BASE_URL}/api/users/profile`,
    PATCH_PROFILE: `${API_BASE_URL}/api/users/profile`,
  },
} as const;