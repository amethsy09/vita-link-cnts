"use client";

import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [alerts] = useState(3); // mock unread count

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0F0F1A]/80 backdrop-blur sticky top-0 z-10">
      <div>
        <h1 className="text-white font-semibold text-base leading-none">{title}</h1>
        {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-white/5 border border-white/10 text-white text-sm pl-9 pr-4 py-1.5 rounded-lg w-48 placeholder:text-white/25 focus:outline-none focus:border-[#8B0000]/50 transition-colors"
          />
        </div>

        {/* Alerts */}
        <button className="relative p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <Bell className="w-4 h-4" />
          {alerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#DC2626] rounded-full text-[9px] text-white flex items-center justify-center font-bold">
              {alerts}
            </span>
          )}
        </button>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[#10B981] text-xs font-medium">Système actif</span>
        </div>
      </div>
    </header>
  );
}
