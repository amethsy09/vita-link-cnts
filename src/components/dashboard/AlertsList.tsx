"use client";

import { AlertTriangle, Info, Zap, X } from "lucide-react";
import { Alert } from "@/types";
import { formatRelativeTime, cn } from "@/lib/utils";

interface AlertsListProps {
  alerts: Alert[];
  onMarkRead?: (id: string) => void;
}

const severityConfig = {
  critical: { icon: Zap, color: "text-[#DC2626]", bg: "bg-[#DC2626]/10 border-[#DC2626]/20" },
  warning: { icon: AlertTriangle, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10 border-[#F59E0B]/20" },
  info: { icon: Info, color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10 border-[#06B6D4]/20" },
};

export function AlertsList({ alerts, onMarkRead }: AlertsListProps) {
  return (
    <div className="space-y-2">
      {alerts.length === 0 && (
        <div className="text-center py-8 text-white/30 text-sm">Aucune alerte active</div>
      )}
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity];
        const Icon = config.icon;
        return (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-all",
              config.bg,
              alert.read && "opacity-50"
            )}
          >
            <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", config.color)} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm leading-snug">{alert.message}</p>
              <p className="text-white/40 text-xs mt-1">{formatRelativeTime(alert.createdAt)}</p>
            </div>
            {!alert.read && onMarkRead && (
              <button
                onClick={() => onMarkRead(alert.id)}
                className="text-white/20 hover:text-white/60 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
