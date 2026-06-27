import { create } from "zustand";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vita_link_token", token);
      localStorage.setItem("vita_link_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vita_link_token");
      localStorage.removeItem("vita_link_user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  initFromStorage: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("vita_link_token");
      const userStr = localStorage.getItem("vita_link_user");
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          set({ user, token, isAuthenticated: true });
        } catch {}
      }
    }
  },
}));
