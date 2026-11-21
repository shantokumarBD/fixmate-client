import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FEF9EF] flex flex-col font-sans">
      {/* Compact Auth Header */}
      <header className="h-14 sticky top-0 z-50 bg-[#FEF9EF]/90 backdrop-blur-md border-b-2 border-[#151515] shrink-0">
        <div className="h-full w-full max-w-5xl mx-auto px-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#FF5B2E] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
              <Wrench className="w-4 h-4 text-[#151515]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base uppercase tracking-tight text-[#151515] leading-none">
                FixMate
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#5B403A] font-semibold">
                Technical Manifest
              </span>
            </div>
          </Link>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-mono text-xs uppercase font-bold text-[#5B403A] hover:text-[#151515] border-2 border-transparent hover:border-[#151515] hover:bg-[#FCD03D] hover:shadow-[2px_2px_0px_#151515] px-2 py-1 rounded transition-all"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Container fitting snugly inside 100vh */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
        {children}
      </main>
    </div>
  );
}