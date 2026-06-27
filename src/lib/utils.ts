import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("fr-SN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  return formatDate(date);
}

export function getStockLevel(current: number, capacity: number): "critical" | "low" | "normal" | "good" {
  const pct = (current / capacity) * 100;
  if (pct <= 10) return "critical";
  if (pct <= 25) return "low";
  if (pct <= 60) return "normal";
  return "good";
}

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

export const BLOOD_GROUP_COLORS: Record<BloodGroup, string> = {
  "A+": "#EF4444",
  "A-": "#F97316",
  "B+": "#8B5CF6",
  "B-": "#EC4899",
  "AB+": "#06B6D4",
  "AB-": "#14B8A6",
  "O+": "#10B981",
  "O-": "#F59E0B",
};
