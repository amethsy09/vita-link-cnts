"use client";

import { BLOOD_GROUP_COLORS, BloodGroup, getStockLevel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StockGaugeProps {
  bloodGroup: BloodGroup;
  quantity: number;
  capacity: number;
  expiresAt?: string;
}

export function StockGauge({ bloodGroup, quantity, capacity, expiresAt }: StockGaugeProps) {
  const pct = Math.min((quantity / capacity) * 100, 100);
  const level = getStockLevel(quantity, capacity);
  const color = BLOOD_GROUP_COLORS[bloodGroup];

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  const levelColors: Record<string, string> = {
    critical: "#DC2626",
    low: "#F59E0B",
    normal: "#06B6D4",
    good: "#10B981",
  };

  const gaugeColor = levelColors[level];

  return (
    <div className="bg-[#161625] border border-white/5 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-white/10 transition-all group">
      {/* Circular gauge */}
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs">{Math.round(pct)}%</span>
        </div>
      </div>

      {/* Blood group label */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
        style={{ background: `${color}25`, border: `2px solid ${color}50` }}
      >
        {bloodGroup}
      </div>

      {/* Stats */}
      <div className="text-center">
        <p className="text-white font-bold text-lg leading-none">{quantity}</p>
        <p className="text-white/30 text-[10px]">/ {capacity} poches</p>
      </div>

      {/* Level badge */}
      <span
        className={cn(
          "text-[10px] font-semibold px-2 py-0.5 rounded-full",
          level === "critical" && "bg-[#DC2626]/15 text-[#DC2626]",
          level === "low" && "bg-[#F59E0B]/15 text-[#F59E0B]",
          level === "normal" && "bg-[#06B6D4]/15 text-[#06B6D4]",
          level === "good" && "bg-[#10B981]/15 text-[#10B981]"
        )}
      >
        {level === "critical" ? "CRITIQUE" : level === "low" ? "BAS" : level === "normal" ? "NORMAL" : "BON"}
      </span>
    </div>
  );
}
