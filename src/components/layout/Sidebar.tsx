"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Droplets,
  FileBarChart,
  Settings,
  LogOut,
  Bell,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/demandes", icon: Droplets, label: "Demandes de sang" },
  { href: "/stocks", icon: HeartPulse, label: "Stocks CNTS" },
  { href: "/structures", icon: Building2, label: "Structures de santé" },
  { href: "/jambaars", icon: Users, label: "Jambaars" },
  { href: "/rapports", icon: FileBarChart, label: "Rapports" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0F0F1A] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B0000] to-[#DC2626] flex items-center justify-center">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">VITA-LINK</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">CNTS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-[#8B0000]/20 text-white border border-[#8B0000]/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-[#DC2626]" : "text-white/40 group-hover:text-white/70")} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 text-[#DC2626]" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B0000] to-[#DC2626] flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) ?? "C"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name ?? "Agent CNTS"}</p>
            <p className="text-white/40 text-[10px] truncate">{user?.role ?? "cnts_admin"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-[#DC2626] transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
