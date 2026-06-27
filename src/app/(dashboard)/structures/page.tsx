"use client";

import { useState, useEffect } from "react";
import { Building2, Search, Filter, CheckCircle, XCircle, Clock, MapPin, Phone, Eye } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Structure } from "@/types";
import { formatDate } from "@/lib/utils";
import { structuresService } from "@/services/structures.service";

const MOCK_STRUCTURES: Structure[] = [
  { id: "1", name: "Hôpital Principal de Dakar", type: "hopital", region: "Dakar", address: "Avenue Nelson Mandela, Dakar", phone: "+221 33 839 50 00", email: "hpd@sante.gouv.sn", status: "active", contactPerson: "Dr. Fatou Diallo", createdAt: "2024-01-15T08:00:00Z", lastRequestAt: new Date(Date.now() - 3600000).toISOString(), totalRequests: 342 },
  { id: "2", name: "Hôpital Aristide Le Dantec", type: "hopital", region: "Dakar", address: "Avenue Pasteur, Dakar", phone: "+221 33 889 10 00", email: "ledantec@sante.gouv.sn", status: "active", contactPerson: "Dr. Ibrahima Sow", createdAt: "2024-01-20T08:00:00Z", lastRequestAt: new Date(Date.now() - 7200000).toISOString(), totalRequests: 218 },
  { id: "3", name: "Clinique Mame Abdou", type: "clinique", region: "Rufisque", address: "Route de Rufisque", phone: "+221 77 123 45 67", email: "contact@cliniquema.sn", status: "pending", contactPerson: "Dr. Aminata Ndiaye", createdAt: new Date(Date.now() - 86400000).toISOString(), totalRequests: 0 },
  { id: "4", name: "Maternité de l'Hôpital Fann", type: "maternite", region: "Dakar", address: "Corniche Ouest, Dakar", phone: "+221 33 869 18 18", email: "fann@sante.gouv.sn", status: "active", contactPerson: "Sage-femme Rokhaya Fall", createdAt: "2024-02-01T08:00:00Z", lastRequestAt: new Date(Date.now() - 1800000).toISOString(), totalRequests: 189 },
  { id: "5", name: "Centre de Santé Médina", type: "centre_sante", region: "Dakar", address: "Médina, Dakar", phone: "+221 33 822 44 00", email: "csmedina@sante.gouv.sn", status: "suspended", contactPerson: "Infirmier Chef Moussa Ba", createdAt: "2024-03-10T08:00:00Z", totalRequests: 45 },
];

const typeLabels: Record<string, string> = {
  hopital: "Hôpital",
  clinique: "Clinique",
  maternite: "Maternité",
  centre_sante: "Centre de Santé",
};

export default function StructuresPage() {
  const [structures, setStructures] = useState<Structure[]>(MOCK_STRUCTURES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = structures.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.region.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const handleValidate = async (id: string) => {
    setActionLoading(id);
    try {
      await structuresService.validate(id);
      setStructures((prev) => prev.map((s) => s.id === id ? { ...s, status: "active" } : s));
    } catch {
      setStructures((prev) => prev.map((s) => s.id === id ? { ...s, status: "active" } : s)); // optimistic
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    all: structures.length,
    active: structures.filter((s) => s.status === "active").length,
    pending: structures.filter((s) => s.status === "pending").length,
    suspended: structures.filter((s) => s.status === "suspended").length,
  };

  return (
    <div>
      <Header title="Structures de santé" subtitle="Gestion et validation des établissements partenaires" />

      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total", value: counts.all, color: "text-white" },
            { label: "Actives", value: counts.active, color: "text-[#10B981]" },
            { label: "En attente", value: counts.pending, color: "text-[#F59E0B]" },
            { label: "Suspendues", value: counts.suspended, color: "text-[#EF4444]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#161625] border border-white/5 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#161625] border border-white/5 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une structure..."
                className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg text-sm placeholder:text-white/20 focus:outline-none focus:border-[#8B0000]/50"
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "pending", "suspended"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-[#8B0000]/20 text-white border border-[#8B0000]/30"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {f === "all" ? "Tout" : f === "active" ? "Actives" : f === "pending" ? "En attente" : "Suspendues"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#161625] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Structure</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Région</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Contact</th>
                <th className="text-left px-5 py-3 font-medium">Statut</th>
                <th className="text-left px-5 py-3 font-medium hidden xl:table-cell">Demandes</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((structure) => (
                <tr key={structure.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#8B0000]/10 border border-[#8B0000]/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-[#DC2626]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{structure.name}</p>
                        <p className="text-white/30 text-xs">{typeLabels[structure.type]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-white/50 text-sm">
                      <MapPin className="w-3 h-3" />
                      {structure.region}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-white/60 text-sm">{structure.contactPerson}</p>
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Phone className="w-2.5 h-2.5" />
                      {structure.phone}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={structure.status as any} />
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <p className="text-white/60 text-sm">{structure.totalRequests ?? 0}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {structure.status === "pending" && (
                        <button
                          onClick={() => handleValidate(structure.id)}
                          disabled={actionLoading === structure.id}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs hover:bg-[#10B981]/20 transition-all disabled:opacity-50"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Valider
                        </button>
                      )}
                      <button className="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/5 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-white/30">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Aucune structure trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
