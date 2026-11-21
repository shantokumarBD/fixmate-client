// src/app/(auth)/layout.tsx
import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FEF9EF] flex flex-col font-sans">
      {/* Auth Header */}
      <header className="sticky top-0 z-50 bg-[#FEF9EF]/90 backdrop-blur-md border-b-2 border-[#151515]">
        <div className="h-16 w-full max-w-5xl mx-auto px-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#FF5B2E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
              <Wrench className="w-5 h-5 text-[#151515]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg uppercase tracking-tight text-[#151515] leading-none">
                FixMate
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B403A] font-semibold">
                Technical Manifest
              </span>
            </div>
          </Link>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase font-bold text-[#5B403A] hover:text-[#151515] border-2 border-transparent hover:border-[#151515] hover:bg-[#FCD03D] hover:shadow-[2px_2px_0px_#151515] px-2.5 py-1.5 rounded transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}