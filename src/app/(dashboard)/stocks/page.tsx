"use client";

import { useState } from "react";
import { HeartPulse, Plus, Minus, Save, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StockGauge } from "@/components/dashboard/StockGauge";
import { BLOOD_GROUPS, BLOOD_GROUP_COLORS, BloodGroup, getStockLevel } from "@/lib/utils";

const INITIAL_STOCKS = BLOOD_GROUPS.map((bg, i) => ({
  id: String(i),
  bloodGroup: bg,
  quantity: [80, 12, 95, 8, 45, 23, 120, 5][i],
  capacity: 150,
  expiresAt: new Date(Date.now() + 86400000 * (i + 3)).toISOString(),
  location: "CNTS Dakar",
  lastUpdated: new Date().toISOString(),
}));

export default function StocksPage() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);

  const handleEdit = (stock: typeof stocks[0]) => {
    setEditId(stock.id);
    setEditQty(stock.quantity);
  };

  const handleSave = (id: string) => {
    setStocks((prev) => prev.map((s) => s.id === id ? { ...s, quantity: editQty, lastUpdated: new Date().toISOString() } : s));
    setEditId(null);
  };

  const criticalStocks = stocks.filter((s) => getStockLevel(s.quantity, s.capacity) === "critical");
  const totalPoches = stocks.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div>
      <Header title="Stocks CNTS" subtitle="Inventaire des Produits Sanguins Labiles (PSL) en temps réel" />

      <div className="p-6 space-y-6">
        {/* Critical alert */}
        {criticalStocks.length > 0 && (
          <div className="bg-[#1A0000] border border-[#DC2626]/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <p className="text-[#DC2626] font-semibold text-sm">
                {criticalStocks.length} groupe(s) sanguin(s) en état critique
              </p>
              <p className="text-white/50 text-sm mt-0.5">
                {criticalStocks.map((s) => s.bloodGroup).join(", ")} — Stock inférieur à 10%. Activation du protocole de mobilisation recommandée.
              </p>
            </div>
          </div>
        )}

        {/* Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#161625] border border-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{totalPoches}</p>
            <p className="text-white/40 text-sm">Poches totales</p>
          </div>
          <div className="bg-[#161625] border border-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-[#DC2626]">{criticalStocks.length}</p>
            <p className="text-white/40 text-sm">Groupes critiques</p>
          </div>
          <div className="bg-[#161625] border border-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-[#10B981]">
              {Math.round((totalPoches / (stocks.length * 150)) * 100)}%
            </p>
            <p className="text-white/40 text-sm">Capacité globale</p>
          </div>
        </div>

        {/* Gauges overview */}
        <div className="bg-[#161625] border border-white/5 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Niveaux par groupe sanguin</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {stocks.map((stock) => (
              <StockGauge
                key={stock.id}
                bloodGroup={stock.bloodGroup as BloodGroup}
                quantity={stock.quantity}
                capacity={stock.capacity}
                expiresAt={stock.expiresAt}
              />
            ))}
          </div>
        </div>

        {/* Detail table with edit */}
        <div className="bg-[#161625] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Gestion des quantités</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Groupe</th>
                <th className="text-left px-5 py-3 font-medium">Quantité</th>
                <th className="text-left px-5 py-3 font-medium">Capacité max</th>
                <th className="text-left px-5 py-3 font-medium">Niveau</th>
                <th className="text-left px-5 py-3 font-medium">Expiration</th>
                <th className="text-left px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stocks.map((stock) => {
                const level = getStockLevel(stock.quantity, stock.capacity);
                const color = BLOOD_GROUP_COLORS[stock.bloodGroup as BloodGroup];
                const levelColors: Record<string, string> = {
                  critical: "text-[#DC2626]",
                  low: "text-[#F59E0B]",
                  normal: "text-[#06B6D4]",
                  good: "text-[#10B981]",
                };
                return (
                  <tr key={stock.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-sm"
                        style={{ background: `${color}20`, border: `2px solid ${color}30` }}
                      >
                        {stock.bloodGroup}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {editId === stock.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditQty((q) => Math.max(0, q - 1))} className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 bg-white/10 border border-white/20 text-white text-sm text-center py-1 rounded focus:outline-none"
                          />
                          <button onClick={() => setEditQty((q) => Math.min(stock.capacity, q + 1))} className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-white font-semibold">{stock.quantity}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-white/50">{stock.capacity}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-medium capitalize ${levelColors[level]}`}>
                        {level === "critical" ? "Critique" : level === "low" ? "Bas" : level === "normal" ? "Normal" : "Bon"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/40 text-sm">
                      {new Date(stock.expiresAt).toLocaleDateString("fr-SN")}
                    </td>
                    <td className="px-5 py-3.5">
                      {editId === stock.id ? (
                        <button
                          onClick={() => handleSave(stock.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs hover:bg-[#10B981]/20 transition-all"
                        >
                          <Save className="w-3 h-3" />
                          Sauvegarder
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(stock)}
                          className="text-white/30 hover:text-white text-xs hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Modifier
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
