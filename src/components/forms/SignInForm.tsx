"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth/auth-client";
import { ROUTES } from "@/constants/routes";
import { signInSchema } from "@/validations/auth";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  
  const router = useRouter();

  const searchParams = useSearchParams();

  const redirectParam =
    searchParams.get("redirect") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("returnUrl");

  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1-Click Quick Demo Fill
  const handleDemoFill = (role: "customer" | "technician" | "admin") => {
    if (!formRef.current) return;
    const form = formRef.current;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement | null;

    if (emailInput && passwordInput) {
      if (role === "customer") {
        emailInput.value = "customer@fixmate.com";
        passwordInput.value = "Pass1234";
      } else if (role === "technician") {
        emailInput.value = "rahim.tech@fixmate.com";
        passwordInput.value = "Pass1234";
      } else {
        emailInput.value = "admin@fixmate.com";
        passwordInput.value = "Pass1234";
      }
      toast.success(`Filled demo ${role} credentials`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawData = {
      email: String(formData.get("email") || "").trim().toLowerCase(),
      password: String(formData.get("password") || ""),
    };

    const validation = signInSchema.safeParse(rawData);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Invalid credentials");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn.email({
        email: validation.data.email,
        password: validation.data.password,
      });

      if (error || !data?.user) {
        toast.error("Invalid email or password. Please sign up first.");
        setIsLoading(false);
        return;
      }

      toast.success(`Welcome back, ${data.user.name || "Operator"}!`);

      // Security: Open-Redirect Vulnerability Guard
      const isInternalRedirect =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//") &&
        !redirectParam.includes("://");

      if (isInternalRedirect) {
        router.push(redirectParam);
      } else {
        const userRole = (data.user as { role?: string })?.role || "customer";
        if (userRole === "admin") {
          router.push(ROUTES.ADMIN.OVERVIEW);
        } else if (userRole === "technician") {
          router.push(ROUTES.TECHNICIAN.OVERVIEW);
        } else {
          router.push(ROUTES.CUSTOMER.OVERVIEW);
        }
      }

      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Authentication error");
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Quick Demo Fill */}
      <div className="bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] p-2.5 shadow-[2px_2px_0px_#151515] mb-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] font-semibold text-[#7A5B53] uppercase">
            ⚡ Quick Demo Fill:
          </span>
          <span className="font-mono text-[9px] text-[#8F7068]">1-Click</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleDemoFill("customer")}
            className="py-1 px-1.5 bg-white border border-[#151515] hover:bg-[#FCD03D] rounded font-mono text-[10px] font-semibold text-[#151515] transition-colors shadow-[1px_1px_0px_#151515] cursor-pointer"
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill("technician")}
            className="py-1 px-1.5 bg-white border border-[#151515] hover:bg-[#FCD03D] rounded font-mono text-[10px] font-semibold text-[#151515] transition-colors shadow-[1px_1px_0px_#151515] cursor-pointer"
          >
            Technician
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill("admin")}
            className="py-1 px-1.5 bg-white border border-[#151515] hover:bg-[#FF5B2E] rounded font-mono text-[10px] font-semibold text-[#151515] transition-colors shadow-[1px_1px_0px_#151515] cursor-pointer"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Email Address */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="email"
            className="font-mono text-[11px] font-medium tracking-wide text-[#7A5B53] uppercase"
          >
            Email Address
          </label>
          <span className="font-mono text-[9px] text-[#8F7068] uppercase">
            REQ // OPERATOR_ID
          </span>
        </div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@domain.com"
          required
          autoComplete="email"
          disabled={isLoading}
          className="w-full block bg-white text-[#151515] font-medium border-2 border-[#151515] rounded-[6px] p-2.5 font-mono text-xs placeholder:text-[#9E9E9E] outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="font-mono text-[11px] font-medium tracking-wide text-[#7A5B53] uppercase"
        >
          Password
        </label>
        <div className="relative w-full">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            required
            autoComplete="current-password"
            disabled={isLoading}
            className="w-full block bg-white text-[#151515] font-medium border-2 border-[#151515] rounded-[6px] p-2.5 pr-10 font-mono text-xs placeholder:text-[#9E9E9E] outline-none transition focus:shadow-[2px_2px_0px_#151515] disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A5B53] hover:text-[#151515] p-1 cursor-pointer flex items-center justify-center"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit CTA Button with Authentic Black Text */}
      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Verifying..."
        className="w-full mt-1"
      >
        <span>Sign In</span>
        <ArrowRight className="w-4 h-4 text-[#151515]" />
      </Button>

      {/* Sign Up Link */}
      <div className="mt-3 pt-3 border-t-2 border-dashed border-[#151515] text-center">
        <span className="font-sans text-xs text-[#7A5B53]">
          Don&apos;t have a FixMate account?
        </span>
        <Link
          href={ROUTES.SIGN_UP}
          className="font-sans text-xs font-bold text-[#FF5B2E] underline ml-1 hover:text-[#B22B00] transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}