"use client";

import { useState } from "react";
import { Users, Search, MapPin, Droplets, Bell, ShieldOff, ShieldCheck, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Jambaar } from "@/types";
import { BLOOD_GROUPS, BLOOD_GROUP_COLORS, BloodGroup, formatRelativeTime } from "@/lib/utils";

const MOCK_JAMBAARS: Jambaar[] = [
  { id: "1", name: "Oumar Diallo", phone: "+221 77 123 45 67", bloodGroup: "O-", region: "Dakar-Fann", latitude: 14.69, longitude: -17.44, status: "active", totalDonations: 8, lastDonationAt: new Date(Date.now() - 90 * 86400000).toISOString(), points: 840, createdAt: "2024-03-01T08:00:00Z" },
  { id: "2", name: "Aissatou Mbaye", phone: "+221 76 987 65 43", bloodGroup: "A+", region: "Plateau", latitude: 14.69, longitude: -17.44, status: "active", totalDonations: 5, lastDonationAt: new Date(Date.now() - 45 * 86400000).toISOString(), points: 520, createdAt: "2024-04-10T08:00:00Z" },
  { id: "3", name: "Ibrahima Sène", phone: "+221 70 456 78 90", bloodGroup: "B-", region: "Médina", latitude: 14.68, longitude: -17.45, status: "cooldown", totalDonations: 3, lastDonationAt: new Date(Date.now() - 55 * 86400000).toISOString(), points: 310, createdAt: "2024-05-20T08:00:00Z" },
  { id: "4", name: "Fatou Ndiaye", phone: "+221 78 321 09 87", bloodGroup: "O+", region: "Pikine", latitude: 14.75, longitude: -17.40, status: "active", totalDonations: 12, lastDonationAt: new Date(Date.now() - 120 * 86400000).toISOString(), points: 1240, createdAt: "2023-11-05T08:00:00Z" },
  { id: "5", name: "Moustapha Ba", phone: "+221 77 654 32 10", bloodGroup: "AB-", region: "Dakar-Fann", latitude: 14.71, longitude: -17.46, status: "suspended", totalDonations: 2, points: 120, createdAt: "2024-06-01T08:00:00Z" },
  { id: "6", name: "Mariama Diop", phone: "+221 76 111 22 33", bloodGroup: "A-", region: "Guédiawaye", latitude: 14.77, longitude: -17.41, status: "active", totalDonations: 7, lastDonationAt: new Date(Date.now() - 80 * 86400000).toISOString(), points: 730, createdAt: "2024-02-14T08:00:00Z" },
];

export default function JambaaarsPage() {
  const [jambaars, setJambaars] = useState<Jambaar[]>(MOCK_JAMBAARS);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyBg, setNotifyBg] = useState("");

  const filtered = jambaars.filter((j) => {
    const matchSearch = j.name.toLowerCase().includes(search.toLowerCase()) || j.region.toLowerCase().includes(search.toLowerCase());
    const matchBlood = bloodFilter === "all" || j.bloodGroup === bloodFilter;
    const matchStatus = statusFilter === "all" || j.status === statusFilter;
    return matchSearch && matchBlood && matchStatus;
  });

  const handleNotify = async () => {
    if (!notifyBg) return;
    setNotifyLoading(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate
    setNotifyLoading(false);
    alert(`Alerte envoyée aux Jambaars ${notifyBg} dans un rayon de 1km !`);
    setNotifyBg("");
  };

  return (
    <div>
      <Header title="Jambaars" subtitle="Annuaire des donneurs volontaires géo-référencés" />

      <div className="p-6 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total inscrits", value: jambaars.length, color: "text-white" },
            { label: "Actifs", value: jambaars.filter((j) => j.status === "active").length, color: "text-[#10B981]" },
            { label: "En repos", value: jambaars.filter((j) => j.status === "cooldown").length, color: "text-[#8B5CF6]" },
            { label: "Suspendus", value: jambaars.filter((j) => j.status === "suspended").length, color: "text-[#EF4444]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#161625] border border-white/5 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Emergency notify panel */}
        <div className="bg-[#1A0000] border border-[#8B0000]/30 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#DC2626]" />
                Mobilisation d'urgence
              </h3>
              <p className="text-white/40 text-sm mt-0.5">Notifier les Jambaars compatibles dans un rayon de 1 km</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={notifyBg}
                onChange={(e) => setNotifyBg(e.target.value)}
                className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#8B0000]/50"
              >
                <option value="">Groupe sanguin...</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              <button
                onClick={handleNotify}
                disabled={!notifyBg || notifyLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B0000] to-[#DC2626] text-white rounded-lg text-sm font-medium hover:from-[#A50000] hover:to-[#EF4444] transition-all disabled:opacity-50"
              >
                {notifyLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                Alerter
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#161625] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un Jambaar..."
              className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8B0000]/50"
            />
          </div>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
          >
            <option value="all">Tous groupes</option>
            {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
          >
            <option value="all">Tous statuts</option>
            <option value="active">Actifs</option>
            <option value="cooldown">En repos</option>
            <option value="suspended">Suspendus</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((jambaar) => {
            const bgColor = BLOOD_GROUP_COLORS[jambaar.bloodGroup as BloodGroup];
            return (
              <div key={jambaar.id} className="bg-[#161625] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
                      style={{ background: `${bgColor}20`, border: `2px solid ${bgColor}40` }}
                    >
                      {jambaar.bloodGroup}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{jambaar.name}</p>
                      <div className="flex items-center gap-1 text-white/40 text-xs">
                        <MapPin className="w-2.5 h-2.5" />
                        {jambaar.region}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={jambaar.status as any} />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-white font-bold text-lg leading-none">{jambaar.totalDonations}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">Dons</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-white font-bold text-lg leading-none">{jambaar.points}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">Points</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-white font-bold text-lg leading-none">
                      {jambaar.totalDonations >= 10 ? "🏆" : jambaar.totalDonations >= 5 ? "⭐" : "🩸"}
                    </p>
                    <p className="text-white/30 text-[10px] mt-0.5">Niveau</p>
                  </div>
                </div>

                {jambaar.lastDonationAt && (
                  <p className="text-white/30 text-xs">Dernier don : {formatRelativeTime(jambaar.lastDonationAt)}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all">
                    Voir profil
                  </button>
                  {jambaar.status === "active" && (
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs hover:bg-[#DC2626]/20 transition-all">
                      <ShieldOff className="w-3 h-3" />
                      Suspendre
                    </button>
                  )}
                  {jambaar.status === "suspended" && (
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs hover:bg-[#10B981]/20 transition-all">
                      <ShieldCheck className="w-3 h-3" />
                      Réactiver
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Aucun Jambaar trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
