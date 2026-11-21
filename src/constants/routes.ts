export const ROUTES = {
  // Public Routes
  HOME: "/",
  SERVICES: "/services",
  SERVICE_DETAILS: (id: string) => `/services/${id}`,
  ABOUT: "/about",

  // Auth Routes
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",

  // Stripe Return Routes
  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_CANCEL: "/payment/cancel",

  // Universal Profile
  PROFILE: "/dashboard/profile",

  // Role-Based Dashboards
  CUSTOMER: {
    OVERVIEW: "/dashboard/customer",
    BOOKINGS: "/dashboard/customer/bookings",
    PAYMENTS: "/dashboard/customer/payments",
  },

  TECHNICIAN: {
    OVERVIEW: "/dashboard/technician",
    ADD_SERVICE: "/dashboard/technician/add-service",
    MY_SERVICES: "/dashboard/technician/my-services",
    EDIT_SERVICE: (id: string) => `/dashboard/technician/my-services/${id}/edit`,
    REQUESTS: "/dashboard/technician/requests",
  },

  ADMIN: {
    OVERVIEW: "/dashboard/admin",
    USERS: "/dashboard/admin/users",
    SERVICES: "/dashboard/admin/services",
    BOOKINGS: "/dashboard/admin/bookings",
    TRANSACTIONS: "/dashboard/admin/transactions",
  },
} as const;