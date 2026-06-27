"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplets, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // const { token, user } = await authService.login({ email, password });
      // console.log(token, user);
      const response = await authService.login({
        email,
        password,
      });

      setAuth(response.user, response.accessToken);
      // setAuth(user, token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0F0F1A] to-[#1A0000]">
        {/* Decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[240, 320, 400, 480].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-[#8B0000]/10"
              style={{
                width: size,
                height: size,
                top: -size / 2,
                left: -size / 2,
              }}
            />
          ))}
        </div>

        {/* Center icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#DC2626] flex items-center justify-center shadow-2xl shadow-[#8B0000]/50">
            <Droplets className="w-12 h-12 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-white tracking-tight">VITA-LINK</h1>
            <p className="text-white/40 uppercase text-xs tracking-[0.3em] mt-1">SIOUT · CNTS</p>
          </div>
          <p className="text-white/30 text-sm text-center max-w-xs leading-relaxed">
            Système d'Information et d'Orchestration d'Urgence Transfusionnelle
          </p>
        </div>

        {/* Stats at bottom */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12">
          {[
            { label: "Jambaars actifs", value: "15K+" },
            { label: "Structures", value: "200+" },
            { label: "Temps moyen", value: "15 min" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-white font-bold text-xl">{value}</p>
              <p className="text-white/30 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B0000] to-[#DC2626] flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black tracking-tight">VITA-LINK CNTS</p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest">SIOUT</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Connexion agent</h2>
          <p className="text-white/40 text-sm mb-8">Accès réservé au personnel CNTS autorisé</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="agent@cnts.sn"
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl placeholder:text-white/20 focus:outline-none focus:border-[#8B0000]/60 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-12 py-3 rounded-xl placeholder:text-white/20 focus:outline-none focus:border-[#8B0000]/60 focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                <p className="text-[#DC2626] text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-white transition-all",
                "bg-gradient-to-r from-[#8B0000] to-[#DC2626]",
                "hover:from-[#A50000] hover:to-[#EF4444] hover:shadow-lg hover:shadow-[#8B0000]/30",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <p className="text-white/20 text-xs text-center mt-8">
            Portail sécurisé Vita-Link SIOUT · Synapse Tech 2026
          </p>
        </div>
      </div>
    </div>
  );
}
