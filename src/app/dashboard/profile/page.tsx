import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { UserRole } from "@/constants/roles";
import { getSessionWithRetry } from "@/lib/auth/session";
import { getMyProfile } from "@/lib/api/user";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile Settings | FixMate Workbench",
};

export default async function DashboardProfilePage() {
  
  const session = await getSessionWithRetry();

  if (!session?.user) {
    redirect(ROUTES.SIGN_IN);
  }


  const liveUser = await getMyProfile();

  
  const profileUser = liveUser || {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email || "",
    image: session.user.image || "",
    role: ((session.user as Record<string, unknown>).role as UserRole) || "customer",
  };

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Station Header */}
      <div className="pb-4 border-b-2 border-[#151515]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-[#FCD03D] border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            STATION 05 // UNIVERSAL IDENTITY
          </span>
          <span className="font-mono text-xs text-[#5B403A]">CREDENTIALS & DISPATCH</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#151515] tracking-tight">
          Profile & Account Settings
        </h1>
        <p className="font-sans text-sm text-[#5B403A] mt-1">
          Manage personal dispatch credentials, service area addresses, and public contact information.
        </p>
      </div>

      {/* 2-Column Responsive Profile Settings Form */}
      <ProfileSettingsForm initialUser={profileUser} />
    </div>
  );
}