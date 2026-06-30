import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StockLevel } from "@/types";
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

export function getStockLevel(
  quantity: number,
  capacity: number
): StockLevel {
  const ratio = quantity / capacity;

  if (ratio <= 0.2) return "CRITICAL";
  if (ratio <= 0.4) return "LOW";
  if (ratio <= 0.7) return "ADEQUATE";
  return "SURPLUS";
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
export const BLOOD_TYPE_LABELS: Record<string, string> = {
  A_POS: "A+",
  A_NEG: "A−",
  B_POS: "B+",
  B_NEG: "B−",
  AB_POS: "AB+",
  AB_NEG: "AB−",
  O_POS: "O+",
  O_NEG: "O−",
};
export const BLOOD_TYPE_COLORS = {
  A_POS: "#EF4444",
  A_NEG: "#F97316",
  B_POS: "#8B5CF6",
  B_NEG: "#EC4899",
  AB_POS: "#06B6D4",
  AB_NEG: "#14B8A6",
  O_POS: "#10B981",
  O_NEG: "#F59E0B",
} as const;