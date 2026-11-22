import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const db = client.db("fixmate");


const configuredOrigins = [
  process.env.BETTER_AUTH_URL || "http://localhost:3000",
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ...(process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(",").map((url) => url.trim())
    : []),
];


export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET,
  trustedOrigins: Array.from(new Set(configuredOrigins)),
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer" },
      phone: { type: "string", defaultValue: "" },
      area: { type: "string", defaultValue: "" },
      bio: { type: "string", defaultValue: "" },
    },
  },
  
  // Security Hook: Prevent privilege escalation upon registration (PDF Security)
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowedRoles = ["customer", "technician"];
          const userRole = (user as Record<string, unknown>).role as string;
          const sanitizedRole = allowedRoles.includes(userRole) ? userRole : "customer";
          return {
            data: {
              ...user,
              role: sanitizedRole,
            },
          };
        },
      },
    },
  },
});