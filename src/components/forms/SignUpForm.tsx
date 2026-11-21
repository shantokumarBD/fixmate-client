"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth/auth-client";
import { ROUTES } from "@/constants/routes";
import { signUpSchema } from "@/validations/auth";
import { RoleSelector } from "./RoleSelector";
import { ImageUploader } from "@/components/shared/ImageUploader";

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [imageUrl, setImageUrl] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      image: imageUrl,
      password: formData.get("password"),
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
      });

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Role Selector */}
      <RoleSelector value={role} onChange={setRole} disabled={isLoading} />

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-mono text-xs font-bold tracking-wider text-[#151515] uppercase"
        >
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Jordan Taylor"
          required
          disabled={isLoading}
          className="w-full bg-white text-[#151515] border-2 border-[#151515] rounded-[8px] p-3 font-mono text-sm outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
        />
      </div>

      {/* Email Address */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-mono text-xs font-bold tracking-wider text-[#151515] uppercase"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@domain.com"
          required
          disabled={isLoading}
          className="w-full bg-white text-[#151515] border-2 border-[#151515] rounded-[8px] p-3 font-mono text-sm outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
        />
      </div>

      {/* Phone Number (Optional) */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="phone"
          className="font-mono text-xs font-bold tracking-wider text-[#151515] uppercase flex items-center justify-between"
        >
          <span>Phone Number</span>
          <span className="text-[10px] text-[#5B403A] font-normal lowercase">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="e.g. +880 1712 345678"
          disabled={isLoading}
          className="w-full bg-white text-[#151515] border-2 border-[#151515] rounded-[8px] p-3 font-mono text-sm outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
        />
      </div>

      {/* ImgBB Image Uploader (HireLoop Pattern) */}
      <ImageUploader
        value={imageUrl}
        onChange={setImageUrl}
        label="Profile Photo"
        disabled={isLoading}
      />

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="font-mono text-xs font-bold tracking-wider text-[#151515] uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
          required
          disabled={isLoading}
          className="w-full bg-white text-[#151515] border-2 border-[#151515] rounded-[8px] p-3 font-mono text-sm outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full bg-[#FF5B2E] border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[8px] py-3.5 px-6 font-heading font-extrabold text-base uppercase tracking-wider text-[#151515] flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create FixMate Account</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Terms Notice */}
      <p className="font-mono text-[11px] text-center text-[#717171] leading-tight">
        By signing up you agree to our terms of service and privacy policy.
      </p>

      {/* Sign In Link */}
      <div className="border-t-2 border-dashed border-[#151515] pt-4 text-center">
        <span className="font-sans text-sm text-[#1D1C16]">
          Already have a FixMate account?
        </span>
        <Link
          href={ROUTES.SIGN_IN}
          className="font-sans text-sm font-bold text-[#FF5B2E] underline ml-1.5 hover:text-[#B22B00] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}