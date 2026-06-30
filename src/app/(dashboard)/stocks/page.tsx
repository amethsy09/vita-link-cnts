"use client";

import { useEffect, useState } from "react";import { Plus, Minus, Save, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import StockGauge from "@/components/dashboard/StockGauge";

import {
  BLOOD_TYPE_LABELS,
  BLOOD_TYPE_COLORS,
} from "@/lib/utils";


import { stocksService, StockDTO } from "@/services/stocks.service";

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);

  //LOAD API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await stocksService.getAll();
        setStocks(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleEdit = (stock: StockDTO) => {
    setEditId(stock.id);
    setEditQty(stock.quantity);
  };

  //SAVE API
  const handleSave = async (id: string) => {
    const stock = stocks.find((s) => s.id === id);

    if (!stock) return;

    const updated = await stocksService.update(
      stock.bloodType,
      editQty
    );
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? updated : s))
    );

    setEditId(null);
  };

  const criticalStocks = stocks.filter(
    (s) => s.level === "CRITICAL"
  );

  const totalPoches = stocks.reduce((sum, s) => sum + s.quantity, 0);

  if (loading) {
    return (
      <div className="p-10 text-white/50">
        Chargement des stocks...
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Stocks CNTS"
        subtitle="Inventaire en temps réel connecté à l'API"
      />

      <div className="p-6 space-y-6">

        {/* ALERT */}
        {criticalStocks.length > 0 && (
          <div className="bg-[#1A0000] border border-[#DC2626]/30 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            <div>
              <p className="text-[#DC2626] font-semibold text-sm">
                {criticalStocks.length} groupes critiques
              </p>
              <p className="text-white/50 text-sm">
                {criticalStocks.map(
                  (s) => BLOOD_TYPE_LABELS[s.bloodType]
                ).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* OVERVIEW */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#161625] p-4 rounded-xl text-center">
            <p className="text-3xl text-white font-bold">{totalPoches}</p>
            <p className="text-white/40 text-sm">Total poches</p>
          </div>

          <div className="bg-[#161625] p-4 rounded-xl text-center">
            <p className="text-3xl text-[#DC2626] font-bold">
              {criticalStocks.length}
            </p>
            <p className="text-white/40 text-sm">Critiques</p>
          </div>
        </div>

        {/* GAUGES */}
        <div className="bg-[#161625] p-5 rounded-xl">
          <h2 className="text-white font-semibold mb-4">
            Niveaux par groupe
          </h2>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {stocks.map((stock) => (
              <StockGauge
                key={stock.id}
                stock={{
                  bloodType: BLOOD_TYPE_LABELS[stock.bloodType],
                  quantity: stock.quantity,
                  level: stock.level,
                }}
              />
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#161625] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="text-white/40 text-xs">
              <tr>
                <th className="px-5 py-3 text-left">Groupe</th>
                <th className="px-5 py-3 text-left">Quantité</th>
                <th className="px-5 py-3 text-left">Niveau</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {stocks.map((stock) => {
                const level = stock.level;

               const color = BLOOD_TYPE_COLORS[stock.bloodType];

                return (
                  <tr key={stock.id} className="border-t border-white/5">
                    <td className="px-5 py-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{
                          background: `${color}20`,
                          border: `1px solid ${color}40`,
                        }}
                      >
                        {BLOOD_TYPE_LABELS[stock.bloodType]}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-white">
                      {stock.quantity}
                    </td>
                    <td className="px-5 py-3 text-white">
                      {level}
                    </td>

                    <td className="px-5 py-3">
                      {editId === stock.id ? (
                        <button
                          onClick={() => handleSave(stock.id)}
                          className="text-green-400 text-xs"
                        >
                          <Save className="w-3 h-3 inline" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(stock)}
                          className="text-white/40 text-xs"
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
};