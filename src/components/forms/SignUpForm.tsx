"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { signUp } from "@/lib/auth/auth-client";
import { ROUTES } from "@/constants/routes";
import { signUpSchema } from "@/validations/auth";
import { RoleSelector } from "./RoleSelector";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      phone: String(formData.get("phone") || "").trim(),
      image: imageUrl,
      password: String(formData.get("password") || ""),
      role,
    };

    const validation = signUpSchema.safeParse(rawData);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Invalid input");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp.email({
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
        role: validation.data.role,
        phone: validation.data.phone || "",
        image: validation.data.image || "",
        callbackURL:
          validation.data.role === "technician"
            ? ROUTES.TECHNICIAN.OVERVIEW
            : ROUTES.CUSTOMER.OVERVIEW,
      } as Parameters<typeof signUp.email>[0]);

      if (error) {
        toast.error(error.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      toast.success(`Welcome to FixMate, ${data?.user?.name || "User"}!`);

      const targetRoute =
        data?.user?.role === "technician"
          ? ROUTES.TECHNICIAN.OVERVIEW
          : ROUTES.CUSTOMER.OVERVIEW;

      router.push(targetRoute);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      {/* Role Selector */}
      <RoleSelector value={role} onChange={setRole} disabled={isLoading} />

      {/* 2-Column Row: Full Name & Phone Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="font-mono text-[11px] font-medium tracking-wide text-[#7A5B53] uppercase"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Jordan Taylor"
            required
            autoComplete="name"
            disabled={isLoading}
            className="w-full bg-white text-[#151515] font-medium border-2 border-[#151515] rounded-[6px] p-2 font-mono text-xs placeholder:text-[#9E9E9E] outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="phone"
            className="font-mono text-[11px] font-medium tracking-wide text-[#7A5B53] uppercase flex items-center justify-between"
          >
            <span>Phone</span>
            <span className="text-[9px] text-[#8F7068] lowercase">(opt)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="017XXXXXXXX"
            autoComplete="tel"
            disabled={isLoading}
            className="w-full bg-white text-[#151515] font-medium border-2 border-[#151515] rounded-[6px] p-2 font-mono text-xs placeholder:text-[#9E9E9E] outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="font-mono text-[11px] font-medium tracking-wide text-[#7A5B53] uppercase"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@domain.com"
          required
          autoComplete="email"
          disabled={isLoading}
          className="w-full bg-white text-[#151515] font-medium border-2 border-[#151515] rounded-[6px] p-2 font-mono text-xs placeholder:text-[#9E9E9E] outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
        />
      </div>

      {/* Image Uploader */}
      <ImageUploader
        value={imageUrl}
        onChange={setImageUrl}
        label="Profile Photo"
        disabled={isLoading}
      />

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="font-mono text-[11px] font-medium tracking-wide text-[#7A5B53] uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
          required
          autoComplete="new-password"
          disabled={isLoading}
          className="w-full bg-white text-[#151515] font-medium border-2 border-[#151515] rounded-[6px] p-2 font-mono text-xs placeholder:text-[#9E9E9E] outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
        />
      </div>

      {/* Submit CTA Button with Authentic Black Text */}
      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Creating Account..."
        className="w-full mt-1"
      >
        <span>Create Account</span>
        <ArrowRight className="w-4 h-4 text-[#151515]" />
      </Button>

      {/* Sign In Link */}
      <div className="border-t-2 border-dashed border-[#151515] pt-2 text-center">
        <span className="font-sans text-xs text-[#7A5B53]">
          Already have an account?
        </span>
        <Link
          href={ROUTES.SIGN_IN}
          className="font-sans text-xs font-bold text-[#FF5B2E] underline ml-1 hover:text-[#B22B00] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}