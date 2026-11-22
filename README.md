# FixMate Client — Smart Device & Home Appliance Repair Platform

> **Platform:** FixMate (On-Demand Consumer Hardware & Appliance Repair Booking System)  
> **Target Exam:** Assignment 9 (Category 006)  
> **Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, BetterAuth, Stripe Checkout, ImgBB, Lucide React

---

## 1. Project Overview & Purpose

**FixMate** is an industrial-grade, neobrutalist web application connecting customers in need of urgent consumer electronics and home appliance repairs with certified expert technicians. The platform enforces strict role-based access control (Customer, Technician, Admin), atomic repair lifecycle workflows, real-time telemetry analytics, and a secure **Pay-After-Service** Stripe financial settlement model.

### Key Capabilities
- **Three Distinct Stakeholder Portals:**
  - **Customer:** Browse certified repair catalog with search, category & mode filters; book repair tickets with date/address/problem validation; real-time order tracking; cancel unstarted tickets; 1-click Pay-After-Service Stripe checkout.
  - **Technician:** Add repair services with ImgBB image uploading; manage catalog availability; accept/reject customer repair requests; advance job state machine (`requested` → `accepted` → `in-progress` → `completed` with mandatory `finalAmount` input).
  - **Admin Control Console:** Platform-wide oversight of GMV revenue, active bookings, service catalog moderation (approval/rejection pipeline), and user management with self-demotion guards.
- **Strict Pay-After-Service Model:** Payment gateway is strictly locked until a technician successfully finishes repair work and enters the verified final labor/parts charge.
- **Zero Duplicate Active Bookings:** Customers cannot submit duplicate active orders for the same repair service.
- **Reload-Safe Architecture:** Universal server-side session guards preserve authentication state on page refresh without token flicker or unintended login redirects.

---

## 2. Live Deployment & Evaluation Credentials

| Service | URL / Value |
| :--- | :--- |
| **Live Client Application** | [https://fixmatebd.vercel.app](https://fixmatebd.vercel.app) |
| **Live Backend API Gateway** | [https://fixmate-server-dk6f.onrender.com](https://fixmate-server-dk6f.onrender.com) |

### Evaluation Test Accounts (Pre-Seeded)
Use the 1-click **Quick Demo Fill** buttons on the `/sign-in` page or manually authenticate with:

| Role | Email Address | Default Password | Initial Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fixmate.com` | `Pass1234` *(or `Admin@12345`)* | `/dashboard/admin` |
| **Technician** | `rahim.tech@fixmate.com` | `Pass1234` | `/dashboard/technician` |
| **Customer** | `customer@fixmate.com` | `Pass1234` | `/dashboard/customer` |

---

## 3. Technology Stack & Key Dependencies

| Category | Package / Tool | Purpose |
| :--- | :--- | :--- |
| **Framework** | `next` (v16+) | Next.js React framework with Turbopack & React 19 Server Components |
| **Styling** | `tailwindcss` (v4), `@tailwindcss/postcss` | Utility-first CSS engine with custom Neobrutalism palette |
| **Authentication** | `better-auth`, `@better-auth/react` | Session authentication, MongoDB user adapter & role authorization |
| **JWT & Security** | `jose` | Cryptographic HS256 JWT signing for secure Express backend API calls |
| **Forms & Validation** | `zod` | Client & server runtime schema validation |
| **Icons & Feedback** | `lucide-react`, `react-hot-toast` | Neobrutalist iconography and real-time operational toasts |
| **Image Hosting** | ImgBB REST API | Cloud image uploads for service banners & profile avatars |

---

## 4. Environment Variables Setup

Create a file named `.env.local` in the root of `fixmate-client`:

```env
# Application Base URL (Frontend)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Express Backend Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Shared Database (BetterAuth uses the same MongoDB as Express)
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=fixmate

# Shared Cryptographic Secret (Must match server JWT_SECRET)
JWT_SECRET=your_jwt_secret_key_minimum_256_bits_long
BETTER_AUTH_SECRET=your_jwt_secret_key_minimum_256_bits_long

# ImgBB Image Upload API Key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
IMGBB_API_KEY=your_imgbb_api_key_here
```

---

## 5. Local Development Setup & Execution

### 5.1 Installation
```bash
cd fixmate-client
npm install
```

### 5.2 Seed User Accounts (BetterAuth)
Run the automated seed script to generate initial hashed user credentials in MongoDB:
```bash
node scripts/seed-users.mjs
```

### 5.3 Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.