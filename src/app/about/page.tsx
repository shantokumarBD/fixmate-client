import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Wrench,
  ShieldCheck,
  Sparkles,
  Clock,
  CreditCard,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Zap,
  ChevronDown,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "How It Works | Engineering-Grade Repair Protocol",
  description:
    "Discover how FixMate delivers verified technicians, 90-day hardware warranties, and zero-dollar upfront escrow repair services.",
};

const PROTOCOL_STEPS = [
  {
    step: "01",
    tag: "DIAGNOSTIC LOG",
    title: "Select Service & Describe Issue",
    desc: "Browse our 7 device categories. Describe your hardware symptoms with at least 20 characters so the assigned specialist arrives with the exact diagnostic tools.",
    badgeColor: "bg-[#FCD03D]",
    icon: Wrench,
  },
  {
    step: "02",
    tag: "DISPATCH & AUDIT",
    title: "Technician Match & Flat Estimate",
    desc: "A vetted technician with hardware-certified diagnostics is allocated. You get a transparent flat estimate with zero hidden surcharges before work begins.",
    badgeColor: "bg-[#FF5B2E] text-white",
    icon: Zap,
  },
  {
    step: "03",
    tag: "WORKSHOP PROTOCOL",
    title: "Precision Calibration & Repair",
    desc: "Repairs are performed on-site or at a calibrated workbench. All components used adhere to OEM specifications and include our 90-day coverage guarantee.",
    badgeColor: "bg-[#151515] text-[#FEF9EF]",
    icon: Clock,
  },
  {
    step: "04",
    tag: "ZERO-UPFRONT ESCROW",
    title: "Pay $0 Today, Settle on Pass",
    desc: "No upfront deposits. You inspect and test the repaired equipment first. Once verified, settle the bill securely via integrated Stripe checkout.",
    badgeColor: "bg-[#FCD03D]",
    icon: CreditCard,
  },
];

const GUARANTEE_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Hardware Vetted Specialists",
    desc: "Every technician on FixMate passes national ID checks, physical workbench testing, and technical capability audits.",
    badge: "100% VERIFIED",
  },
  {
    icon: CreditCard,
    title: "Escrow Payment Protection",
    desc: "You never pay in advance. Payment is unlocked only after you test your repaired device and sign off on completion.",
    badge: "$0 ADVANCE",
  },
  {
    icon: Sparkles,
    title: "90-Day Workbench Warranty",
    desc: "All repaired switches, circuits, motors, and replaced components are backed by a full 90-day labor and parts guarantee.",
    badge: "90-DAY COVERAGE",
  },
];

const FAQS = [
  {
    question: "What happens if my device cannot be repaired?",
    answer:
      "If a device cannot be restored due to obsolete parts or catastrophic circuit damage, you owe $0 for repair labor. FixMate strictly operates on a pay-for-results protocol.",
  },
  {
    question: "How does the 'Pay After Completion' policy work?",
    answer:
      "When you book a repair, your card is never charged upfront. After the technician finishes the service, the booking status changes to 'Completed', unlocking the secure Stripe Pay button inside your My Bookings dashboard.",
  },
  {
    question: "Can I cancel a repair request after submitting?",
    answer:
      "Yes. As long as your repair request is in the 'Requested' state (before technician dispatch), you can cancel it with one click from your Customer Dashboard with zero penalty.",
  },
  {
    question: "Are replacement parts authentic?",
    answer:
      "All technicians are contractually required to use certified OEM or grade-A compliant hardware parts. Every replaced part carries our standard 90-day warranty.",
  },
];

// স্মার্ট ডায়নামিক বাটন (লগইন থাকলে ড্যাশবোর্ড দেখাবে, না থাকলে সাইন-আপ)
async function DynamicCtaButton() {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    const role = ((user as Record<string, unknown>).role as string || "customer").toLowerCase();
    const dashboardHref =
      role === "admin"
        ? ROUTES.ADMIN.OVERVIEW
        : role === "technician"
        ? ROUTES.TECHNICIAN.OVERVIEW
        : ROUTES.CUSTOMER.OVERVIEW;

    return (
      <Link
        href={dashboardHref}
        className="w-full sm:w-auto py-3 px-5 bg-white text-[#151515] border-2 border-[#151515] rounded-[6px] font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#151515] hover:bg-[#FEF9EF] hover:shadow-[1px_1px_0px_#151515] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center flex items-center justify-center gap-1.5"
      >
        <span>Go to Dashboard</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.SIGN_UP}
      className="w-full sm:w-auto py-3 px-5 bg-white text-[#151515] border-2 border-[#151515] rounded-[6px] font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#151515] hover:bg-[#FEF9EF] hover:shadow-[1px_1px_0px_#151515] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
    >
      Join as Tech
    </Link>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FEF9EF] text-[#151515] font-sans selection:bg-[#FF5B2E] selection:text-white pb-20">
      
      {/* 1. Header & Protocol Tag Strip */}
      <section className="border-b-2 border-[#151515] bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl space-y-4">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FCD03D] border-2 border-[#151515] rounded-[4px] shadow-[2px_2px_0px_#151515]">
              <span className="w-2 h-2 rounded-full bg-[#151515]" />
              <span className="font-mono text-xs uppercase font-extrabold tracking-wider text-[#151515]">
                #FX-PROTOCOL // HOW FIXMATE WORKS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#151515] uppercase tracking-tight leading-none">
              Engineering-Grade Repair Protocol.
            </h1>

            {/* Subtext */}
            <p className="font-sans text-sm sm:text-base text-[#151515]/80 leading-relaxed font-medium">
              We replaced informal repair uncertainty with standardized diagnostic benchmarks, verified technicians, and a transparent pay-after-service escrow model.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Four-Step Technical Workflow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-dashed border-[#151515] pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF5B2E] uppercase tracking-wider block">
              {"// WORKBENCH DISPATCH"}
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] uppercase tracking-tight mt-1">
              The 4-Step Repair Lifecycle
            </h2>
          </div>
          <span className="font-mono text-xs text-[#151515]/60">
            Standard operating procedure for every ticket
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROTOCOL_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_#151515] transition-all"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-[#151515]">
                      {item.step}
                    </span>
                    <span
                      className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] border border-[#151515] uppercase ${item.badgeColor}`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Icon Box */}
                  <div className="w-10 h-10 bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#151515]" />
                  </div>

                  {/* Step Content */}
                  <h3 className="font-heading font-extrabold text-base text-[#151515] uppercase mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-[#151515]/75 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-6 pt-3 border-t border-[#151515]/20 flex items-center justify-between font-mono text-[10px] text-[#151515]/60 font-bold uppercase">
                  <span>Phase {item.step}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Guarantees & Trust Pillars */}
      <section className="bg-[#FFFFFF] border-y-2 border-[#151515] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="font-mono text-xs font-bold text-[#151515] bg-[#FCD03D] px-2.5 py-0.5 border border-[#151515] rounded shadow-[2px_2px_0px_#151515] uppercase">
              WORKBENCH SECURITY
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#151515] uppercase tracking-tight">
              Our 3 Non-Negotiable Guarantees
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GUARANTEE_PILLARS.map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.title}
                  className="bg-[#FEF9EF] border-2 border-[#151515] rounded-[10px] shadow-[4px_4px_0px_#151515] p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-[#FF5B2E] border-2 border-[#151515] rounded-[8px] shadow-[2px_2px_0px_#151515] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#151515]" />
                    </div>
                    <span className="font-mono text-[10px] font-black bg-[#151515] text-white px-2 py-0.5 rounded-[3px] uppercase">
                      {g.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-[#151515] uppercase">
                    {g.title}
                  </h3>
                  <p className="font-sans text-xs text-[#151515]/80 leading-relaxed font-medium">
                    {g.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Native Zero-JS Interactive FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#5B403A] uppercase">
            <HelpCircle className="w-4 h-4 text-[#FF5B2E]" />
            <span>DISPATCH ADVISORY</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Pure Native HTML5 <details> & <summary> (Zero React State / Zero Overhead) */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white border-2 border-[#151515] rounded-[8px] shadow-[3px_3px_0px_#151515] overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none font-heading font-extrabold text-sm sm:text-base text-[#151515] uppercase hover:bg-[#FEF9EF] transition-colors">
                <span>{faq.question}</span>
                <ChevronDown className="w-4 h-4 text-[#151515] transition-transform duration-200 group-open:rotate-180 shrink-0 ml-2" />
              </summary>
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 font-sans text-xs sm:text-sm text-[#151515]/80 leading-relaxed border-t-2 border-dashed border-[#151515]/20 pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FCD03D] border-2 border-[#151515] rounded-[10px] shadow-[6px_6px_0px_#151515] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515]">
              {"// FAST RESPONSE DISPATCH"}
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] uppercase tracking-tight">
              Ready to restore your device?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#151515]/80 max-w-md font-medium">
              Schedule your diagnostic scan in under 2 minutes. Pay $0 upfront with guaranteed satisfaction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href={ROUTES.SERVICES}
              className="w-full sm:w-auto py-3 px-6 bg-[#FF5B2E] text-[#151515] border-2 border-[#151515] rounded-[6px] font-heading font-extrabold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#151515] hover:shadow-[1px_1px_0px_#151515] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-center"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* ডায়নামিক বাটন: লগইন থাকলে ড্যাশবোর্ডে যাবে, না থাকলে সাইন-আপ */}
            <Suspense
              fallback={
                <div className="w-full sm:w-36 h-10 bg-white/40 border-2 border-[#151515]/30 rounded-[6px] animate-pulse" />
              }
            >
              <DynamicCtaButton />
            </Suspense>
          </div>
        </div>
      </section>

    </div>
  );
}