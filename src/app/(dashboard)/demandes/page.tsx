"use client";

import { useState } from "react";
import { Droplets, Search, QrCode, CheckCircle, XCircle, Truck, Clock, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BloodRequest } from "@/types";
import { BLOOD_GROUP_COLORS, BloodGroup, formatRelativeTime } from "@/lib/utils";

const MOCK_REQUESTS: BloodRequest[] = [
  { id: "1", structureId: "1", structureName: "HPD - Bloc Urgences", bloodGroup: "O-", quantity: 3, urgency: "critical", status: "pending", requestedAt: new Date(Date.now() - 8 * 60000).toISOString(), updatedAt: new Date(Date.now() - 8 * 60000).toISOString(), notes: "Hémorragie post-partum sévère. Patient en état critique." },
  { id: "2", structureId: "2", structureName: "Hôpital Le Dantec", bloodGroup: "A+", quantity: 2, urgency: "high", status: "reserved", requestedAt: new Date(Date.now() - 22 * 60000).toISOString(), updatedAt: new Date(Date.now() - 18 * 60000).toISOString(), qrCode: "QR-2024-002" },
  { id: "3", structureId: "4", structureName: "Maternité Fann", bloodGroup: "B+", quantity: 1, urgency: "critical", status: "in_transit", requestedAt: new Date(Date.now() - 45 * 60000).toISOString(), updatedAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: "4", structureId: "3", structureName: "Clinique Suma", bloodGroup: "AB+", quantity: 2, urgency: "normal", status: "delivered", requestedAt: new Date(Date.now() - 120 * 60000).toISOString(), updatedAt: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: "5", structureId: "5", structureName: "Centre Santé Médina", bloodGroup: "A-", quantity: 1, urgency: "high", status: "pending", requestedAt: new Date(Date.now() - 5 * 60000).toISOString(), updatedAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: "6", structureId: "1", structureName: "HPD - Traumatologie", bloodGroup: "O+", quantity: 4, urgency: "critical", status: "cancelled", requestedAt: new Date(Date.now() - 180 * 60000).toISOString(), updatedAt: new Date(Date.now() - 175 * 60000).toISOString() },
];

const urgencyConfig: Record<string, { label: string; className: string; icon: any }> = {
  critical: { label: "Critique", className: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20", icon: Zap },
  high: { label: "Haute", className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20", icon: Clock },
  normal: { label: "Normal", className: "bg-white/5 text-white/40 border-white/10", icon: Droplets },
};

export default function DemandesPage() {
  const [requests, setRequests] = useState<BloodRequest[]>(MOCK_REQUESTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const filtered = requests.filter((r) => {
    const matchSearch = r.structureName.toLowerCase().includes(search.toLowerCase()) || r.bloodGroup.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchUrgency = urgencyFilter === "all" || r.urgency === urgencyFilter;
    return matchSearch && matchStatus && matchUrgency;
  });

  const handleReserve = (id: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "reserved" } : r));
  };

  const handleDeliver = (id: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "delivered" } : r));
  };

  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    reserved: requests.filter((r) => r.status === "reserved").length,
    in_transit: requests.filter((r) => r.status === "in_transit").length,
    delivered: requests.filter((r) => r.status === "delivered").length,
  };

  return (
    <div>
      <Header title="Demandes de sang" subtitle="Gestion des bons de commande des structures de santé" />

      <div className="p-6 space-y-6">
        {/* Status pipeline */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "En attente", value: counts.pending, color: "#F59E0B" },
            { label: "Réservées", value: counts.reserved, color: "#06B6D4" },
            { label: "En transit", value: counts.in_transit, color: "#8B5CF6" },
            { label: "Livrées", value: counts.delivered, color: "#10B981" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#161625] border border-white/5 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: color }} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#161625] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par structure ou groupe..."
              className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8B0000]/50"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm">
            <option value="all">Tous statuts</option>
            <option value="pending">En attente</option>
            <option value="reserved">Réservées</option>
            <option value="in_transit">En transit</option>
            <option value="delivered">Livrées</option>
            <option value="cancelled">Annulées</option>
          </select>
          <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm">
            <option value="all">Toute urgence</option>
            <option value="critical">Critique</option>
            <option value="high">Haute</option>
            <option value="normal">Normale</option>
          </select>
        </div>

        {/* Requests list */}
        <div className="space-y-3">
          {filtered.map((req) => {
            const bgColor = BLOOD_GROUP_COLORS[req.bloodGroup as BloodGroup] ?? "#8B0000";
            const urg = urgencyConfig[req.urgency];
            const UrgIcon = urg.icon;
            return (
              <div
                key={req.id}
                className={`bg-[#161625] border rounded-xl p-5 transition-all ${
                  req.urgency === "critical" && req.status === "pending"
                    ? "border-[#DC2626]/30 shadow-[0_0_20px_rgba(220,38,38,0.05)]"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Blood group */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                    style={{ background: `${bgColor}20`, border: `2px solid ${bgColor}40` }}
                  >
                    {req.bloodGroup}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-white font-semibold">{req.structureName}</p>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${urg.className}`}>
                        <UrgIcon className="w-3 h-3" />
                        {urg.label}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm">{req.quantity} poche(s) · Demandé {formatRelativeTime(req.requestedAt)}</p>
                    {req.notes && <p className="text-white/30 text-xs mt-1 italic truncate">{req.notes}</p>}
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={req.status as any} />
                    <div className="flex gap-2">
                      {req.status === "pending" && (
                        <button
                          onClick={() => handleReserve(req.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-xs hover:bg-[#06B6D4]/20 transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Réserver
                        </button>
                      )}
                      {req.status === "reserved" && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs hover:bg-[#8B5CF6]/20 transition-all">
                          <QrCode className="w-3.5 h-3.5" />
                          QR Code
                        </button>
                      )}
                      {req.status === "in_transit" && (
                        <button
                          onClick={() => handleDeliver(req.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs hover:bg-[#10B981]/20 transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Confirmer livraison
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <Droplets className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Aucune demande trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
