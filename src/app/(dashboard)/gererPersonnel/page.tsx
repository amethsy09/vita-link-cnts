"use client";

import { useEffect, useState } from "react";
import { equipeService, StaffMember } from "@/services/equipe.service";
import { staffSchema } from "@/schemas/staff.schema";

export default function GererPersonnelPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    isStructureAdmin: false,
  });

  // 📥 LOAD STAFF
  const loadStaff = async () => {
    setLoadingList(true);
    try {
      const res = await equipeService.getStaff();
      setStaff(res.staff);
    } catch {
      setError("Erreur chargement personnel");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // ✍️ INPUT HANDLER
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setFieldErrors({});

    // ✅ VALIDATION ZOD
    const result = staffSchema.safeParse(form);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });

      setFieldErrors(errors);
      return;
    }

    setLoadingCreate(true);

    try {
      await equipeService.createStaff(result.data);

      setSuccess("Agent créé avec succès 🎉");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        isStructureAdmin: false,
      });

      setIsModalOpen(false);
      await loadStaff();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError("Email ou téléphone déjà utilisé");
      } else {
        setError("Erreur serveur");
      }
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B14] text-white p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Gestion du personnel
          </h1>
          <p className="text-white/40 text-sm">
            Gérez les agents de votre structure
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          + Nouveau agent
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <p className="text-white/40 text-sm">Total agents</p>
          <p className="text-xl font-bold">{staff.length}</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <p className="text-white/40 text-sm">Admins structure</p>
          <p className="text-xl font-bold">
            {staff.filter(s => s.isStructureAdmin).length}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <p className="text-white/40 text-sm">Agents simples</p>
          <p className="text-xl font-bold">
            {staff.filter(s => !s.isStructureAdmin).length}
          </p>
        </div>
      </div>

      {/* LIST HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Personnel de la structure
        </h2>
        <span className="text-white/40 text-sm">
          {staff.length} membres
        </span>
      </div>

      {/* LIST */}
      {loadingList ? (
        <p className="text-white/50">Chargement...</p>
      ) : (
        <div className="space-y-2">
          {staff.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
            >
              <div>
                <p className="font-medium">{m.firstName}</p>
                <p className="text-white/40 text-sm">{m.email}</p>
              </div>

              {m.isStructureAdmin && (
                <span className="text-xs bg-red-600/30 text-red-300 px-2 py-1 rounded">
                  Admin
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* modal */}
          <div className="relative w-full max-w-lg bg-[#0F0F1A] border border-white/10 rounded-xl p-6">

            {/* header */}
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Ajouter un agent
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* FIRSTNAME */}
              <div>
                <input
                  name="firstName"
                  placeholder="Prénom"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full p-2 bg-black/30 border border-white/10 rounded"
                />
                {fieldErrors.firstName && (
                  <p className="text-red-400 text-xs">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              {/* LASTNAME */}
              <div>
                <input
                  name="lastName"
                  placeholder="Nom"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full p-2 bg-black/30 border border-white/10 rounded"
                />
                {fieldErrors.lastName && (
                  <p className="text-red-400 text-xs">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-2 bg-black/30 border border-white/10 rounded"
                />
                {fieldErrors.email && (
                  <p className="text-red-400 text-xs">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <input
                  name="phone"
                  placeholder="Téléphone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-2 bg-black/30 border border-white/10 rounded"
                />
                {fieldErrors.phone && (
                  <p className="text-red-400 text-xs">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-2 bg-black/30 border border-white/10 rounded"
                />
                {fieldErrors.password && (
                  <p className="text-red-400 text-xs">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* CHECKBOX */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isStructureAdmin"
                  checked={form.isStructureAdmin}
                  onChange={handleChange}
                />
                Administrateur de structure
              </label>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loadingCreate}
                className="w-full bg-red-600 hover:bg-red-700 p-2 rounded"
              >
                {loadingCreate ? "Création..." : "Créer l'agent"}
              </button>

              {/* ERRORS */}
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {success && (
                <p className="text-green-400 text-sm">{success}</p>
              )}

            </form>
          </div>
        </div>
      )}
    </div>
  );
}