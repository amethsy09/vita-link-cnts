import { cn } from "@/lib/utils";

type StatusType =
  | "active" | "pending" | "suspended" | "cooldown"
  | "critical" | "reserved" | "in_transit" | "delivered" | "cancelled"
  | "normal" | "high" | "low";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: { label: "Actif", className: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" },
  pending: { label: "En attente", className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20" },
  suspended: { label: "Suspendu", className: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" },
  cooldown: { label: "Repos", className: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20" },
  critical: { label: "Critique", className: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20" },
  reserved: { label: "Réservé", className: "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20" },
  in_transit: { label: "En transit", className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20" },
  delivered: { label: "Livré", className: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" },
  cancelled: { label: "Annulé", className: "bg-white/5 text-white/40 border-white/10" },
  normal: { label: "Normal", className: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" },
  high: { label: "Haute", className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20" },
  low: { label: "Basse", className: "bg-white/5 text-white/40 border-white/10" },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-white/5 text-white/40 border-white/10" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", config.className, className)}>
      {config.label}
    </span>
  );
}
