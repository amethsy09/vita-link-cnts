"use client";

import { useState, useEffect } from "react";
import { Activity, Droplets, Users, Building2, AlertTriangle, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { StockGauge } from "@/components/dashboard/StockGauge";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardStats, Alert, BloodStock } from "@/types";
import { BLOOD_GROUPS, BloodGroup, formatRelativeTime } from "@/lib/utils";

// Mock data for when API is unavailable
const MOCK_STATS: DashboardStats = {
  totalStocks: 847,
  criticalStocks: 2,
  pendingRequests: 7,
  activeJambaars: 3_241,
  todayDonations: 34,
  todayRequests: 19,
  resolvedToday: 16,
  activeStructures: 48,
};

const MOCK_STOCKS: BloodStock[] = BLOOD_GROUPS.map((bg, i) => ({
  id: String(i),
  bloodGroup: bg,
  quantity: [80, 12, 95, 8, 45, 23, 120, 5][i],
  capacity: 150,
  expiresAt: new Date(Date.now() + 86400000 * (i + 3)).toISOString(),
  location: "CNTS Dakar",
  lastUpdated: new Date().toISOString(),
}));

const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    type: "critical_stock",
    message: "Stock O- critique : 5 poches restantes (3% de la capacité). Activation du protocole de mobilisation.",
    severity: "critical",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "urgent_request",
    message: "Demande urgente de 3 poches A+ de l'Hôpital Principal de Dakar — Bloc opératoire actif.",
    severity: "critical",
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "new_structure",
    message: "Nouvelle structure en attente de validation : Clinique Mame Abdou (Rufisque).",
    severity: "warning",
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    read: false,
  },
  {
    id: "4",
    type: "system",
    message: "34 Jambaars ont répondu à l'appel de mobilisation du secteur Fann-Mermoz ce matin.",
    severity: "info",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: true,
  },
];

const MOCK_REQUESTS = [
  { id: "1", structureName: "HPD - Bloc Urgences", bloodGroup: "O-", quantity: 3, urgency: "critical", status: "pending", requestedAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: "2", structureName: "Hôpital Aristide Le Dantec", bloodGroup: "A+", quantity: 2, urgency: "high", status: "reserved", requestedAt: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: "3", structureName: "Maternité de l'Hôpital Fann", bloodGroup: "B+", quantity: 1, urgency: "critical", status: "in_transit", requestedAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: "4", structureName: "Clinique Suma", bloodGroup: "AB+", quantity: 2, urgency: "normal", status: "delivered", requestedAt: new Date(Date.now() - 120 * 60000).toISOString() },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [stocks, setStocks] = useState<BloodStock[]>(MOCK_STOCKS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, stocksData, alertsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getStocks(),
          dashboardService.getAlerts(),
        ]);
        setStats(statsData);
        setStocks(stocksData);
        setAlerts(alertsData);
      } catch {
        // Keep mock data
      }
    };
    fetchData();
  }, []);

  const handleMarkRead = async (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
    try {
      await dashboardService.markAlertRead(alertId);
    } catch {}
  };

  const urgencyColors: Record<string, string> = {
    critical: "text-[#DC2626]",
    high: "text-[#F59E0B]",
    normal: "text-white/50",
  };

  return (
    <div>
      <Header
        title="Vue d'ensemble"
        subtitle={`${new Date().toLocaleDateString("fr-SN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      />

      <div className="p-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Poches disponibles" value={stats.totalStocks} icon={Droplets} accent="#10B981" delta="Stock national consolidé" />
          <KPICard label="Stocks critiques" value={stats.criticalStocks} icon={AlertTriangle} accent="#DC2626" delta="Groupes sous 10%" deltaPositive={false} />
          <KPICard label="Demandes en cours" value={stats.pendingRequests} icon={Activity} accent="#F59E0B" />
          <KPICard label="Jambaars actifs" value={stats.activeJambaars.toLocaleString("fr")} icon={Users} accent="#8B5CF6" delta="+127 ce mois" deltaPositive />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Dons aujourd'hui" value={stats.todayDonations} icon={TrendingUp} accent="#06B6D4" />
          <KPICard label="Demandes du jour" value={stats.todayRequests} icon={Clock} accent="#F97316" />
          <KPICard label="Résolues aujourd'hui" value={stats.resolvedToday} icon={CheckCircle2} accent="#10B981" />
          <KPICard label="Structures actives" value={stats.activeStructures} icon={Building2} accent="#8B5CF6" />
        </div>

        {/* Stocks + Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Blood stocks */}
          <div className="xl:col-span-2 bg-[#161625] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-white font-semibold">Stocks par groupe sanguin</h2>
                <p className="text-white/30 text-xs mt-0.5">Niveaux en temps réel — CNTS Dakar</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-white/30">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#DC2626] inline-block" /> Critique</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block" /> Bas</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" /> Bon</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
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

          {/* Alerts */}
          <div className="bg-[#161625] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Alertes système</h2>
              <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                {alerts.filter((a) => !a.read).length} nouvelles
              </span>
            </div>
            <AlertsList alerts={alerts} onMarkRead={handleMarkRead} />
          </div>
        </div>

        {/* Recent requests */}
        <div className="bg-[#161625] border border-white/5 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-white font-semibold">Dernières demandes de sang</h2>
            <a href="/demandes" className="text-[#DC2626] text-sm hover:text-[#EF4444] transition-colors">
              Voir tout →
            </a>
          </div>
          <div className="divide-y divide-white/5">
            {MOCK_REQUESTS.map((req) => (
              <div key={req.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/2 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 border border-[#8B0000]/20 flex items-center justify-center text-white font-black text-sm">
                  {req.bloodGroup}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{req.structureName}</p>
                  <p className="text-white/40 text-xs">{req.quantity} poche(s) · {formatRelativeTime(req.requestedAt)}</p>
                </div>
                <span className={`text-xs font-semibold uppercase ${urgencyColors[req.urgency]}`}>
                  {req.urgency === "critical" ? "⚡ Critique" : req.urgency === "high" ? "▲ Haute" : "Normal"}
                </span>
                <StatusBadge status={req.status as any} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
