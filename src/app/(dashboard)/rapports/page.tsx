"use client";

import { useState } from "react";
import { FileBarChart, Download, TrendingUp, TrendingDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { BLOOD_GROUP_COLORS, BloodGroup, BLOOD_GROUPS } from "@/lib/utils";

const donationsData = [
  { month: "Jan", dons: 280, demandes: 240 },
  { month: "Fév", dons: 320, demandes: 295 },
  { month: "Mar", dons: 410, demandes: 380 },
  { month: "Avr", dons: 290, demandes: 310 },
  { month: "Mai", dons: 460, demandes: 420 },
  { month: "Jun", dons: 380, demandes: 350 },
  { month: "Jul", dons: 530, demandes: 480 },
];

const bloodGroupData = BLOOD_GROUPS.map((bg, i) => ({
  name: bg,
  value: [180, 45, 320, 28, 150, 65, 420, 22][i],
  color: BLOOD_GROUP_COLORS[bg as BloodGroup],
}));

const responseTimeData = [
  { heure: "06h", temps: 18 },
  { heure: "08h", temps: 12 },
  { heure: "10h", temps: 9 },
  { heure: "12h", temps: 14 },
  { heure: "14h", temps: 11 },
  { heure: "16h", temps: 8 },
  { heure: "18h", temps: 13 },
  { heure: "20h", temps: 16 },
  { heure: "22h", temps: 22 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0F0F1A] border border-white/10 rounded-lg p-3 text-sm">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RapportsPage() {
  const [period, setPeriod] = useState("7j");

  return (
    <div>
      <Header title="Rapports & Statistiques" subtitle="Analyse de performance du système Vita-Link" />

      <div className="p-6 space-y-6">
        {/* Period selector + export */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 bg-[#161625] border border-white/5 rounded-lg p-1">
            {["7j", "30j", "3m", "12m"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                  period === p ? "bg-[#8B0000]/20 text-white border border-[#8B0000]/30" : "text-white/40 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-lg text-sm transition-all">
            <Download className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Taux de résolution", value: "94.2%", delta: "+2.3%", positive: true },
            { label: "Temps moyen livraison", value: "13 min", delta: "-4 min vs mois dernier", positive: true },
            { label: "Taux de réponse Jambaars", value: "78%", delta: "+12%", positive: true },
            { label: "Poches périmées", value: "3", delta: "-8 vs mois dernier", positive: true },
          ].map(({ label, value, delta, positive }) => (
            <div key={label} className="bg-[#161625] border border-white/5 rounded-xl p-4">
              <p className="text-white/40 text-xs mb-2">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {delta}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Area chart dons vs demandes */}
          <div className="bg-[#161625] border border-white/5 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Dons vs Demandes (2025)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={donationsData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="dons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="demandes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="dons" stroke="#10B981" fill="url(#dons)" strokeWidth={2} name="Dons" />
                <Area type="monotone" dataKey="demandes" stroke="#DC2626" fill="url(#demandes)" strokeWidth={2} name="Demandes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart groupes sanguins */}
          <div className="bg-[#161625] border border-white/5 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Distribution des dons par groupe sanguin</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie data={bloodGroupData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {bloodGroupData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {bloodGroupData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-white/60 text-xs">{name}</span>
                    </div>
                    <span className="text-white text-xs font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Response time chart */}
        <div className="bg-[#161625] border border-white/5 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Temps de réponse moyen par heure (minutes)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={responseTimeData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="heure" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="temps" fill="#8B0000" radius={[4, 4, 0, 0]} name="Temps (min)">
                {responseTimeData.map((entry, i) => (
                  <Cell key={i} fill={entry.temps > 15 ? "#DC2626" : entry.temps > 10 ? "#F59E0B" : "#10B981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-[10px]">
            <span className="flex items-center gap-1 text-white/30"><span className="w-2 h-2 rounded bg-[#10B981]" /> &lt; 10 min (cible)</span>
            <span className="flex items-center gap-1 text-white/30"><span className="w-2 h-2 rounded bg-[#F59E0B]" /> 10–15 min</span>
            <span className="flex items-center gap-1 text-white/30"><span className="w-2 h-2 rounded bg-[#DC2626]" /> &gt; 15 min (alerte)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
