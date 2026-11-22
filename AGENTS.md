<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# FixMate Agent Map & Architecture Reference

> **FixMate** is an on-demand device & home appliance repair service platform built with Next.js 16 (App Router), Express 5 REST API, MongoDB Native Driver, Stripe Pay-After-Service, and BetterAuth with `jose` HS256 JWT bridge.

---

## 1. ROLE MODEL

| Role | Assignment | Dashboard Route | Pages Allowed to Open | API Groups Allowed | Ownership Rule |
|:---|:---|:---|:---|:---|:---|
| **customer** | Sign-up default (forced by DB hook) | `/dashboard/customer` | Overview, My Bookings, Payments, Profile | `/api/bookings` (create, list own, cancel own), `/api/payments` (checkout, verify, my), `/api/users` | `customerEmail` matches `user.email` |
| **technician**| Selected at sign-up (sanitized by DB hook) | `/dashboard/technician` | Overview, My Services, Add Service, Edit Service, Requests, Profile | `/api/services` (create, edit own, delete own, toggle availability), `/api/bookings/technician`, `/api/bookings/:id/status`, `/api/users` | `technicianEmail` matches `user.email` |
| **admin** | Database Seed Only (blocked at sign-up) | `/dashboard/admin` | Overview, Users, Services Moderation, Bookings Audit, Transactions Audit, Profile | `/api/admin/*` (stats, users, role update, service approval, all bookings, all payments), `/api/users` | Platform-wide audit; cannot change own role |

---

## 2. ROUTE ACCESS MAP

| Route Group | URL Paths | Guard Mechanism |
|:---|:---|:---|
| **Public** | `/`, `/about`, `/services`, `/services/[id]`, `/payment/cancel` | None (Publicly accessible) |
| **Auth** | `/sign-in`, `/sign-up` | Auth Layout, redirect logic if session exists |
| **Shared Auth** | `/dashboard`, `/dashboard/profile`, `/payment/success` | `DashboardLayout` checks `session.user` via `getSession()`, redirects to `/sign-in` |
| **Customer** | `/dashboard/customer`, `/dashboard/customer/bookings`, `/dashboard/customer/payments` | `DashboardLayout` (Authenticated session) |
| **Technician** | `/dashboard/technician`, `/dashboard/technician/my-services`, `/dashboard/technician/my-services/[id]/edit`, `/dashboard/technician/add-service`, `/dashboard/technician/requests` | `TechnicianLayout` calls `await requireRole("technician")` |
| **Admin** | `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/services`, `/dashboard/admin/bookings`, `/dashboard/admin/transactions` | `AdminLayout` calls `await requireRole("admin")` |

---

## 3. AUTH ARCHITECTURE

1. **Sign-Up Sanitization:** BetterAuth MongoDB hook (`databaseHooks.user.create.before`) checks submitted role. Only `customer` or `technician` is accepted; any other input defaults to `customer`. `admin` accounts cannot be created via sign-up.
2. **Session Creation:** BetterAuth authenticates user via email/password and sets standard session cookies (`better-auth.session_token`).
3. **JWT Bridge (Next.js to Express):**
   - Server Action `syncTokenCookieAction` reads session via `getSession()` and signs a standard HS256 JWT using `jose` (`SignJWT`) containing `id`, `email`, `name`, `role`, and `exp` claims.
   - Sets an HttpOnly `token` cookie for persistent browser reload safety.
   - Server-side data fetching uses `authFetch`, which calls `getToken()` to generate and attach the signed JWT in the `Authorization: Bearer <token>` header.
4. **Express Token Verification (`verifyToken`):**
   - Strictly pins algorithm to `HS256` to reject forged tokens.
   - Enforces `exp` and `email` claims.
   - Performs a live lookup in MongoDB `user` collection by `email` to attach fresh user data and current role.
5. **Express Role Guards:**
   - `verifyCustomer`: Enforces `req.user.role === "customer"`, returns 403 otherwise.
   - `verifyTechnician`: Enforces `req.user.role === "technician"`, returns 403 otherwise.
   - `verifyAdmin`: Enforces `req.user.role === "admin"`, returns 403 otherwise.

---

## 4. GUARD LAYERS

Access control is enforced across four distinct boundaries:
1. **Layer 1 — UI Presentation (Visual):** Action buttons (Cancel, Pay Now, Complete Job, Role select) hide or disable conditionally.
2. **Layer 2 — Next.js Server Components (Routing):** `requireRole()` and layout guards execute before page render, redirecting unauthorized users.
3. **Layer 3 — Express API Middlewares (Transport):** `verifyToken` and role guards (`verifyCustomer`, `verifyTechnician`, `verifyAdmin`) block unauthorized HTTP calls with 401/403.
4. **Layer 4 — Database Query Filters (Data Ownership):** Controllers filter every mutation and private query by `{ customerEmail: req.user.email }` or `{ technicianEmail: req.user.email }`.
> *Note: Server layers (Layers 2, 3, and 4) represent the real security boundary; UI state is convenience only.*

---

## 5. DATA MODEL SUMMARY

| Collection | Key Fields | Links & Relationships |
|:---|:---|:---|
| `user` | `name`, `email` (unique), `role`, `phone`, `area`, `bio`, `image`, `createdAt` | Referenced by `services.technicianEmail`, `bookings.customerEmail`, `bookings.technicianEmail` |
| `services` | `title`, `category` (7 types), `description`, `image`, `basePrice`, `estimatedDuration`, `serviceMode`, `serviceArea`, `technicianName`, `technicianEmail`, `approvalStatus`, `isAvailable` | Belongs to Technician via `technicianEmail`; referenced by `bookings.serviceId` |
| `bookings` | `serviceId`, `serviceTitle`, `basePrice`, `finalAmount`, `technicianName`, `technicianEmail`, `customerName`, `customerEmail`, `customerPhone`, `address`, `preferredDate`, `problemDescription`, `status`, `paymentStatus` | Links Customer (`customerEmail`) and Technician (`technicianEmail`) to Service (`serviceId`) |
| `payments` | `bookingId`, `serviceTitle`, `customerEmail`, `technicianEmail`, `amount`, `currency`, `transactionId`, `stripeSessionId` (unique), `paymentStatus`, `paidAt` | Links to `bookings._id` via `bookingId`; records Stripe financial settlement |

---

## 6. STATUS PIPELINE (State Machine)

| Current Status | Allowed Next Status | Allowed Actor | Enforced Business Rules |
|:---|:---|:---|:---|
| `requested` | `accepted`, `rejected`, `cancelled` | Technician (accept/reject), Customer (cancel) | Customer can cancel only in `requested`; technician cannot accept own service |
| `accepted` | `in-progress` | Technician | Work begins; cancellation disabled |
| `in-progress` | `completed` | Technician | Technician must supply `finalAmount > 0` |
| `completed` | Terminal (No next status) | None | Enables Customer Stripe payment (`paymentStatus === "unpaid"`) |
| `rejected` | Terminal (No next status) | None | Request closed |
| `cancelled` | Terminal (No next status) | None | Request closed |

---

## 7. PAYMENT ARCHITECTURE

1. **Checkout Session Creation (`POST /api/payments/create-checkout-session`):**
   - Customer must be the booking owner (`booking.customerEmail === req.user.email`).
   - Booking status must be strictly `completed` (Pay-After-Service rule).
   - Booking `paymentStatus` must be `unpaid`.
   - Charge amount is read strictly from `booking.finalAmount` in MongoDB (client amount is never trusted).
2. **Session Verification (`GET /api/payments/verify`):**
   - Retrieves session directly from Stripe.
   - Validates session status is `complete` / `paid`.
   - Verifies `session.metadata.customerEmail` matches `req.user.email`.
   - Calls idempotent settlement helper.
3. **Webhook Processing (`POST /api/payments/webhook`):**
   - Mounted with `express.raw({ type: "application/json" })` before JSON body parser.
   - Verifies cryptographic signature using `stripe.webhooks.constructEvent`.
   - Handles `checkout.session.completed` when `payment_status === "paid"`.
4. **Idempotency Defense:**
   - In-memory check against `payments` by `stripeSessionId`.
   - Conditional atomic update: `bookings.updateOne({ _id: bookingId, paymentStatus: "unpaid" }, { $set: { paymentStatus: "paid" } })`.
   - Unique database index on `payments.stripeSessionId` (catches error code 11000).

---

## 8. ENVIRONMENT VARIABLES & OPERATIONAL COMMANDS

### Required Environment Variable Names (No Values)

**Client (`fixmate-client`):**
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `JWT_SECRET`
- `MONGODB_URI`
- `IMGBB_API_KEY`
- `TRUSTED_ORIGINS` (optional)

**Server (`fixmate-server`):**
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Permitted Verification Commands
```bash
# Client Repo (fixmate-client)
npm run lint          # Check ESLint rules
npx tsc --noEmit      # Verify TypeScript compilation
npm run build         # Production Turbopack build
npm audit             # Audit package vulnerabilities

# Server Repo (fixmate-server)
npm start             # Start Express production server
npm run dev           # Start Express development server
npm audit             # Audit server dependencies
```

### Prohibited Actions (Do Not Touch)
- Do NOT edit files during read-only audit sessions.
- Do NOT run database seed or wipe scripts without explicit user permission.
- Do NOT store plain secrets in client code or prefix backend secrets with `NEXT_PUBLIC_`.
- Do NOT bypass Express token verification or role checks.

### Audit & Reference Documents Index
- Architecture & Lifecycles: `docs/audit/01-ARCHITECTURE.md`
- Client Deep Review: `docs/audit/02-CLIENT-REVIEW.md`
- Server Deep Review: `docs/audit/03-SERVER-REVIEW.md`
- Requirements Matrix: `docs/audit/04-REQUIREMENTS-MATRIX.md`
- Security & Deployment: `docs/audit/05-SECURITY-QUALITY-DEPLOYMENT.md`
- Fix Plan: `docs/audit/06-FIX-PLAN.md`
- Platform Engineering Playbook: `docs/PLAYBOOK-role-based-platform.md`
