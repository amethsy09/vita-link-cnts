"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, initFromStorage } = useAuthStore();

  useEffect(() => {
    initFromStorage();
  }, []);

  useEffect(() => {
    // Give storage init a tick
    const timer = setTimeout(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.push("/login");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0A0A14]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
