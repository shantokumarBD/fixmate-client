import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Error: MONGODB_URI is not defined in .env.local or .env");
  process.exit(1);
}

const secret = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET;
if (!secret) {
  console.error("Error: BETTER_AUTH_SECRET or JWT_SECRET is required");
  process.exit(1);
}

const client = new MongoClient(uri);

async function seedUsers() {
  try {
    await client.connect();
    console.log("Connected to MongoDB for user seeding...");

    const db = client.db(process.env.MONGODB_DB_NAME || "fixmate");
    const userCollection = db.collection("user");
    const accountCollection = db.collection("account");

    const auth = betterAuth({
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      secret: secret,
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
    });

    const demoUsers = [
      {
        name: "FixMate Administrator",
        email: "admin@fixmate.com",
        password: "Pass1234",
        role: "admin",
        phone: "+8801711000001",
        area: "Gulshan, Dhaka",
        bio: "Chief Platform Operations & Service Moderation Manager",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Rahim Chowdhury",
        email: "rahim.tech@fixmate.com",
        password: "Pass1234",
        role: "technician",
        phone: "+8801711000002",
        area: "Mirpur & Dhanmondi, Dhaka",
        bio: "Master Technician with 8+ years experience in AC, Refrigerator, and TV repairing.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Demo Technician",
        email: "technician@fixmate.com",
        password: "Pass1234",
        role: "technician",
        phone: "+8801711000002",
        area: "Mirpur & Dhanmondi, Dhaka",
        bio: "Master Technician with 8+ years experience in AC, Refrigerator, and TV repairing.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Tanvir Ahmed",
        email: "tanvir.tech@fixmate.com",
        password: "Pass1234",
        role: "technician",
        phone: "+8801711000003",
        area: "Uttara & Banani, Dhaka",
        bio: "Certified hardware specialist for Smartphones, Laptops, MacBooks, and Smart Gadgets.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Shanto Customer",
        email: "shanto.customer@gmail.com",
        password: "Pass1234",
        role: "customer",
        phone: "+8801711000004",
        area: "Dhanmondi, Dhaka",
        bio: "Smart home enthusiast and regular FixMate customer.",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Demo Customer",
        email: "customer@fixmate.com",
        password: "Pass1234",
        role: "customer",
        phone: "+8801711000005",
        area: "Banani, Dhaka",
        bio: "FixMate platform customer for repair bookings.",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Other Customer",
        email: "other.customer@fixmate.com",
        password: "Pass1234",
        role: "customer",
        phone: "+8801711000006",
        area: "Uttara, Dhaka",
        bio: "Registered customer for authorization test scenarios.",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      },
    ];
    console.log(`\nSeeding ${demoUsers.length} demo accounts via BetterAuth sign-up API...`);

    for (const u of demoUsers) {
      const existingUser = await userCollection.findOne({ email: u.email });
      let needsSignUp = false;

      if (!existingUser) {
        needsSignUp = true;
      } else {
        const existingAccount = await accountCollection.findOne({
          $or: [
            { userId: existingUser._id },
            { userId: existingUser._id.toString() },
            { accountId: u.email },
          ],
        });

        if (!existingAccount) {
          console.log(`[CLEANUP] Found orphaned user without credential account: ${u.email}. Recreating cleanly...`);
          await userCollection.deleteOne({ _id: existingUser._id });
          needsSignUp = true;
        } else {
          console.log(`[EXISTS] User and credential account already present: ${u.email}`);
        }
      }

      if (needsSignUp) {
        await auth.api.signUpEmail({
          body: {
            name: u.name,
            email: u.email,
            password: u.password,
          },
        });
        console.log(`[CREATED] Successfully signed up: ${u.email}`);
      }

      // প্রোফাইল ফিল্ড ও রোল সরাসরি ডেটাবেজে সিঙ্ক
      await userCollection.updateOne(
        { email: u.email },
        {
          $set: {
            name: u.name,
            role: u.role,
            phone: u.phone,
            area: u.area,
            bio: u.bio,
            image: u.image,
            emailVerified: true,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`[UPDATED] Profile synced (role: ${u.role}) for: ${u.email}`);
    }

    console.log("\n=================================================");
    console.log("  All Demo Accounts Successfully Seeded!         ");
    console.log("=================================================");
    console.log("Password for all accounts: Pass1234\n");
    console.log("1. Admin:        admin@fixmate.com");
    console.log("2. Technician 1: rahim.tech@fixmate.com");
    console.log("3. Technician 2: tanvir.tech@fixmate.com");
    console.log("4. Customer:     customer@fixmate.com");
    console.log("5. Customer:     shanto.customer@gmail.com");
    console.log("=================================================\n");
  } catch (err) {
    console.error("User seeding failed:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedUsers();