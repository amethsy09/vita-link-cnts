"use client";

import { useEffect, useState } from "react";
import {
  Droplets,
  Search,
  QrCode,
  CheckCircle,
  Truck,
  Clock,
  Zap,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BloodRequest } from "@/types";
import { BLOOD_GROUP_COLORS, BloodGroup, formatRelativeTime } from "@/lib/utils";
import { requestsService } from "@/services/requests.service";

const urgencyConfig: Record<
  string,
  { label: string; className: string; icon: any }
> = {
  critical: {
    label: "Critique",
    className: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20",
    icon: Zap,
  },
  high: {
    label: "Haute",
    className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    icon: Clock,
  },
  normal: {
    label: "Normal",
    className: "bg-white/5 text-white/40 border-white/10",
    icon: Droplets,
  },
};

export default function DemandesPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔁 LOAD DATA FROM API (PAGINATED SAFE)
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await requestsService.getAll({
          page: 1,
          limit: 50,
        });

        // ✅ SAFE extraction (paginated API)
        const data = Array.isArray(res?.data) ? res.data : [];

        setRequests(data);
      } catch (err: any) {
        setError(err?.message || "Erreur API");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  // 🔎 SAFE FILTERS
  const filtered = (requests ?? []).filter((r) => {
    const matchSearch =
      (r.structureName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.bloodGroup ?? "").toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || r.status === statusFilter;

    const matchUrgency =
      urgencyFilter === "all" || r.urgency === urgencyFilter;

    return matchSearch && matchStatus && matchUrgency;
  });

  // 🔁 ACTIONS (CNTS HANDLE ONLY — BACKEND LOGIC)
  const handleProcess = async (id: string) => {
    try {
      const updated = await requestsService.handle(id);

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      console.error("Handle error:", err);
    }
  };

  const handleCancel = async (id: string) => {
    const request = requests.find((r) => r.id === id);

    // 🔒 sécurité UI (évite appel inutile API)
    if (!request || request.status !== "pending") {
      console.warn("Cancel interdit : statut non annulable");
      return;
    }

    try {
      // ⚡ optimistic update (UI immédiate)
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "cancelled" } : r
        )
      );

      await requestsService.cancel(id);

    } catch (err: any) {
      console.error("Cancel error:", err);

      // 🔄 rollback si erreur API (400 / 403)
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "pending" } : r
        )
      );
    }
  };

  // 📊 COUNTS (SAFE)
  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    reserved: requests.filter((r) => r.status === "reserved").length,
    in_transit: requests.filter((r) => r.status === "in_transit").length,
    delivered: requests.filter((r) => r.status === "delivered").length,
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="p-10 text-white/50">
        Chargement des demandes...
      </div>
    );
  }

  // ❌ ERROR
  if (error) {
    return (
      <div className="p-10 text-red-400">
        Erreur API : {error}
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Demandes de sang"
        subtitle="Gestion CNTS des demandes hospitalières"
      />

      <div className="p-6 space-y-6">

        {/* STATUS CARDS */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "En attente", value: counts.pending, color: "#F59E0B" },
            { label: "Réservées", value: counts.reserved, color: "#06B6D4" },
            { label: "En transit", value: counts.in_transit, color: "#8B5CF6" },
            { label: "Livrées", value: counts.delivered, color: "#10B981" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-[#161625] border border-white/5 rounded-xl p-4 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 w-full h-0.5"
                style={{ background: color }}
              />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="bg-[#161625] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-white/10 text-white px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">Tous statuts</option>
            <option value="pending">En attente</option>
            <option value="reserved">Réservées</option>
            <option value="in_transit">En transit</option>
            <option value="delivered">Livrées</option>
            <option value="cancelled">Annulées</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="bg-gray-900 border border-white/10 text-white px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">Toute urgence</option>
            <option value="critical">Critique</option>
            <option value="high">Haute</option>
            <option value="normal">Normale</option>
          </select>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {filtered.map((req) => {
            const bgColor =
              BLOOD_GROUP_COLORS[req.bloodGroup as BloodGroup] ?? "#8B0000";

            const urg = urgencyConfig[req.urgency] || urgencyConfig.normal;
            const UrgIcon = urg.icon;

            return (
              <div
                key={req.id}
                className="bg-[#161625] border border-white/5 rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* BLOOD GROUP */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm"
                    style={{
                      background: `${bgColor}20`,
                      border: `2px solid ${bgColor}40`,
                    }}
                  >
                    {req.bloodGroup}
                  </div>

                  {/* INFO */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">
                        {req.structureName}
                      </p>

                      <span className={`text-xs px-2 py-0.5 rounded border ${urg.className}`}>
                        <UrgIcon className="w-3 h-3 inline mr-1" />
                        {urg.label}
                      </span>
                    </div>

                    <p className="text-white/50 text-sm">
                      {req.quantity} poche(s) · {formatRelativeTime(req.requestedAt)}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    {req.status === "pending" && (
                      <button
                        onClick={() => handleProcess(req.id)}
                        className="px-3 py-1.5 text-xs bg-[#06B6D4]/10 text-[#06B6D4] rounded-lg"
                      >
                        Traiter
                      </button>
                    )}

                    {req.status !== "cancelled" && (
                      <button
                        disabled={req.status !== "pending"}
                        onClick={() => handleCancel(req.id)}
                        className={`px-3 py-1.5 text-xs rounded-lg ${req.status !== "pending"
                          ? "bg-gray-500/10 text-gray-500 cursor-not-allowed"
                          : "bg-red-500/10 text-red-400"
                          }`}
                      >
                        Annuler
                      </button>
                    )}

                    <StatusBadge status={req.status as any} />
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY */}
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