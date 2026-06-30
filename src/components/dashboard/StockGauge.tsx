import type { StockLevel } from "@/types";

export interface StockGaugeProps {
  stock: {
    bloodType: string;
    quantity: number;
    level: StockLevel;
  };
}

const COLORS: Record<StockLevel, string> = {
  CRITICAL: "bg-red-500",
  LOW: "bg-yellow-500",
  ADEQUATE: "bg-green-500",
  SURPLUS: "bg-cyan-500",
};

export default function StockGauge({ stock }: StockGaugeProps) {
  return (
    <div className="p-3 bg-[#161625] rounded-xl border border-white/5">
      <p className="text-white font-bold">{stock.bloodType}</p>

      <p className="text-white/40 text-sm">
        {stock.quantity} poche(s)
      </p>

      <div className="h-1 bg-white/10 rounded mt-2">
        <div
          className={`h-full ${COLORS[stock.level]}`}
          style={{ width: "100%" }}
        />
      </div>

      <p className="text-xs text-white/50 mt-2">
        {stock.level}
      </p>
    </div>
  );
}