"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import { ROUTES } from "@/constants/routes";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push(ROUTES.SIGN_IN);
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const role = user.role || "customer";
  const dashboardHref =
    role === "admin"
      ? ROUTES.ADMIN.OVERVIEW
      : role === "technician"
      ? ROUTES.TECHNICIAN.OVERVIEW
      : ROUTES.CUSTOMER.OVERVIEW;

  const initials = (user.name?.[0] || user.email?.[0] || "U").toUpperCase();

  return (
    <DropdownMenu>
      {/* Neobrutalist Trigger */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 p-1.5 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] hover:bg-[#FEF9EF] transition-all cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          aria-label="User menu"
        >
          <Avatar>
            {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#151515] hidden sm:inline max-w-[100px] truncate">
            {user.name?.split(" ")[0] || "Operator"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#151515]" />
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent align="end" className="w-64">
        {/* User Info Header */}
        <div className="p-2 bg-[#FEF9EF] border-2 border-[#151515] rounded-[6px] mb-1">
          <p className="font-heading font-extrabold text-xs text-[#151515] uppercase truncate">
            {user.name || "Operator"}
          </p>
          <p className="font-mono text-[10px] text-[#5B403A] truncate">
            {user.email || ""}
          </p>
          <div className="mt-1.5">
            <RoleBadge role={role} />
          </div>
        </div>

        {/* Navigation Items */}
        <DropdownMenuItem asChild>
          <Link href={dashboardHref} className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE} className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>Profile Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Destructive Sign Out Item */}
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}