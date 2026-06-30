"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  Droplets,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import  StockGauge  from "@/components/dashboard/StockGauge";
import { AlertsList } from "@/components/dashboard/AlertsList";

import { dashboardService } from "@/services/dashboard.service";

import {
  DashboardData,
  Alert,
} from "@/types";

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [dashboardData, alertsData] =
          await Promise.all([
            dashboardService.getDashboard(),
            dashboardService.getAlerts(),
          ]);

        setDashboard(dashboardData);

        setAlerts(alertsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleMarkRead = async (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
    try {
      await dashboardService.markAlertRead(alertId);
    } catch { }
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

          <KPICard
            loading={loading}
            label="Demandes en attente"
            value={
              dashboard?.kpis.pendingRequests ?? 0
            }
            icon={Activity}
            accent="#F59E0B"
          />

          <KPICard
            loading={loading}
            label="Stocks critiques"
            value={
              dashboard?.kpis.criticalStocks ?? 0
            }
            icon={AlertTriangle}
            accent="#DC2626"
          />

          <KPICard
            loading={loading}
            label="Alertes actives"
            value={
              dashboard?.kpis.activeAlerts ?? 0
            }
            icon={AlertTriangle}
            accent="#8B0000"
          />

          <KPICard
            loading={loading}
            label="Total des dons"
            value={
              dashboard?.kpis.totalDonations ?? 0
            }
            icon={Droplets}
            accent="#10B981"
          />

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
              {dashboard?.bloodStocks.map(stock => (
                <StockGauge
                  key={stock.bloodType}
                  stock={stock}
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
            {<div className="divide-y divide-white/5">

              {dashboard?.recentRequests.length === 0 && (

                <div className="p-8 text-center text-white/40">

                  Aucune demande récente

                </div>

              )}

              {dashboard?.recentRequests.map(request => (

                <div
                  key={request.id}
                  className="px-5 py-4 flex items-center gap-4"
                >

                  <div className="w-10 h-10 rounded-lg bg-[#8B0000]/10 border border-[#8B0000]/20 flex items-center justify-center font-bold text-white">

                    {request.bloodType}

                  </div>

                  <div className="flex-1">

                    <p className="text-white">

                      {request.requestingHospital.name}

                    </p>

                    <p className="text-white/40 text-sm">

                      {request.quantityNeeded} poche(s)

                    </p>

                  </div>

                </div>

              ))}

            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
