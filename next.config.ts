// File: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind v4 Turbopack CSS Loader (UI স্টাইলিং কার্যকর রাখার জন্য আবশ্যক)
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;