"use client";

import  { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import { updateUserRoleAction } from "@/actions/admin";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Wrench,
  UserCheck,
  Inbox,
  Shield,
} from "lucide-react";

interface AdminUsersTableProps {
  users: User[];
  currentUserEmail?: string;
}

type RoleFilter = "all" | "customer" | "technician" | "admin";

export function AdminUsersTable({ users, currentUserEmail }: AdminUsersTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RoleFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Role Change Confirmation Target
  const [pendingChange, setPendingChange] = useState<{
    user: User;
    newRole: string;
  } | null>(null);

  const tabs = [
    { id: "all" as RoleFilter, label: "All Users", count: users.length },
    {
      id: "customer" as RoleFilter,
      label: "Customers",
      count: users.filter((u) => u.role === "customer").length,
    },
    {
      id: "technician" as RoleFilter,
      label: "Technicians",
      count: users.filter((u) => u.role === "technician").length,
    },
    {
      id: "admin" as RoleFilter,
      label: "Admins",
      count: users.filter((u) => u.role === "admin").length,
    },
  ];

  const filteredUsers = users.filter((u) => {
    if (activeTab !== "all" && u.role !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmRoleChange = () => {
    if (!pendingChange) return;

    const targetId = pendingChange.user._id || pendingChange.user.id;
    if (!targetId) {
      toast.error("User ID not found");
      return;
    }

    startTransition(async () => {
      const res = await updateUserRoleAction(targetId, pendingChange.newRole);
      if (res.success) {
        toast.success(res.message || "User role updated successfully");
        setPendingChange(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update user role");
      }
    });
  };

  const roleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-[#FF5B2E] text-white border-[#151515]";
      case "technician":
        return "bg-[#FCD03D] text-[#151515] border-[#151515]";
      default:
        return "bg-[#DBEAFE] text-[#1E40AF] border-[#93C5FD]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5B403A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] font-sans text-xs sm:text-sm text-[#151515] placeholder:text-[#5B403A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] transition-all rounded-[6px]"
          />
        </div>

        <div className="font-mono text-xs text-[#5B403A] flex items-center gap-1.5 self-end sm:self-center">
          <span>ACCOUNTS LOGGED:</span>
          <span className="font-bold text-[#151515] bg-[#FEF9EF] border-2 border-[#151515] px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_#151515]">
            {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#151515] rounded-[6px] transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#151515] text-white shadow-[2px_2px_0px_#FF5B2E]"
                  : "bg-white text-[#151515] shadow-[2px_2px_0px_#151515] hover:bg-[#FEF9EF]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                  isActive ? "bg-[#FF5B2E] text-white" : "bg-[#F2EDE3] text-[#151515]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Users Table */}
      <div className="bg-white border-2 border-[#151515] shadow-[4px_4px_0px_#151515] rounded-[10px] overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center bg-[#FEF9EF]/30">
            <div className="w-12 h-12 bg-[#FCD03D] border-2 border-[#151515] rounded-[8px] flex items-center justify-center shadow-[3px_3px_0px_#151515] mb-3">
              <Inbox className="w-6 h-6 text-[#151515]" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#151515]">
              No Users Found
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5B403A] max-w-sm mt-1">
              No registered user accounts match your selected role filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FEF9EF] border-b-2 border-[#151515] font-mono text-xs text-[#151515] uppercase">
                  <th className="py-3 px-4 font-bold tracking-wider">User Account</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Contact Details</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Current Role</th>
                  <th className="py-3 px-4 font-bold tracking-wider">Registered On</th>
                  <th className="py-3 px-4 font-bold tracking-wider text-right">RBAC Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#151515] font-sans text-xs sm:text-sm">
                {filteredUsers.map((u) => {
                  const userId = u._id || u.id || "";
                  const isSelf = u.email === currentUserEmail;

                  return (
                    <tr key={userId} className="hover:bg-[#FEF9EF]/50 transition-colors">
                      {/* User Account Avatar & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#FF5B2E] border-2 border-[#151515] overflow-hidden relative flex items-center justify-center text-white font-bold text-xs uppercase shadow-[1px_1px_0px_#151515] shrink-0">
                            {u.image ? (
                              <Image
                                src={u.image}
                                alt={u.name || "User"}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            ) : (
                              <span>{u.name ? u.name.charAt(0) : "U"}</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-heading font-bold text-[#151515] leading-tight truncate">
                              {u.name || "FixMate Member"}
                            </span>
                            <span className="font-mono text-[10px] text-[#5B403A]">
                              ID: #{userId.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-[#151515] block">
                          {u.email}
                        </span>
                        {u.phone ? (
                          <span className="font-mono text-[11px] text-[#5B403A] block">
                            {u.phone}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-neutral-400 block">
                            No phone provided
                          </span>
                        )}
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] font-mono text-[11px] font-bold uppercase border ${roleBadgeStyle(
                            u.role
                          )}`}
                        >
                          {u.role === "admin" && <Shield className="w-3 h-3" />}
                          {u.role === "technician" && <Wrench className="w-3 h-3" />}
                          {u.role === "customer" && <UserCheck className="w-3 h-3" />}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-[#5B403A]">
                        {u.createdAt ? formatDate(u.createdAt) : "Member"}
                      </td>

                      {/* Role Switcher Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        {isSelf ? (
                          <span className="font-mono text-[11px] font-bold text-[#FF5B2E] bg-[#FEF9EF] border border-[#151515] px-2 py-1 rounded-[4px]">
                            Current Session
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <select
                              value={u.role}
                              onChange={(e) =>
                                setPendingChange({
                                  user: u,
                                  newRole: e.target.value,
                                })
                              }
                              disabled={isPending}
                              className="px-2.5 py-1 bg-white border-2 border-[#151515] rounded-[6px] shadow-[2px_2px_0px_#151515] font-mono text-xs font-bold uppercase text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FF5B2E] cursor-pointer"
                            >
                              <option value="customer">Role: Customer</option>
                              <option value="technician">Role: Technician</option>
                              <option value="admin">Role: Admin</option>
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Role Modification */}
      <ConfirmDialog
        isOpen={!!pendingChange}
        onClose={() => setPendingChange(null)}
        onConfirm={handleConfirmRoleChange}
        title="Change User Permission Level?"
        description={`Are you sure you want to change the role of "${pendingChange?.user.name}" (${pendingChange?.user.email}) to "${pendingChange?.newRole.toUpperCase()}"? This will modify their access privileges immediately.`}
        badge="SECURITY // RBAC ROLE SWITCH"
        confirmText="Confirm Role Change"
        cancelText="Cancel"
        variant="warning"
        isLoading={isPending}
      />
    </div>
  );
}