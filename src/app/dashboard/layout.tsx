import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardAuthGuard } from "./DashboardAuthGuard";
import DashboardLoading from "./loading";

export const metadata: Metadata = {
  title: "Workbench Dashboard | FixMate",
  description: "Manage your smart device repair tickets, technician manifests, and payments.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardAuthGuard>{children}</DashboardAuthGuard>
    </Suspense>
  );
}