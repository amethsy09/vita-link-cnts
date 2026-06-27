import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: number | string;
  delta?: string;
  deltaPositive?: boolean;
  icon: LucideIcon;
  accent?: string;
  loading?: boolean;
}

export function KPICard({ label, value, delta, deltaPositive, icon: Icon, accent = "#8B0000", loading }: KPICardProps) {
  return (
    <div className="bg-[#161625] border border-white/5 rounded-xl p-5 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 blur-2xl"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-20 bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          <p className="text-white/50 text-sm mt-1">{label}</p>
          {delta && (
            <p className={cn("text-xs mt-2 font-medium", deltaPositive ? "text-[#10B981]" : "text-[#EF4444]")}>
              {delta}
            </p>
          )}
        </>
      )}
    </div>
  );
}
