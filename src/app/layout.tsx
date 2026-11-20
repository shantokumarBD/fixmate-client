import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "FixMate | Smart Device & Home Appliance Repair Service",
    template: "%s | FixMate",
  },
  description:
    "On-demand smart device & home appliance repair service booking platform with verified technicians and pay-after-service model.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#FEF9EF] text-[#151515] font-sans antialiased flex flex-col">
        {/* Global Toaster with Workshop Neobrutalist Theme */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#FFFFFF",
              color: "#151515",
              border: "2px solid #151515",
              boxShadow: "4px 4px 0px #151515",
              borderRadius: "8px",
              fontFamily: "var(--font-mono)",
              fontWeight: "600",
              fontSize: "13px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}