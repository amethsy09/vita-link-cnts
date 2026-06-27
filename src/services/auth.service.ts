import apiClient from "@/lib/api/client";
import { User } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout").catch(() => {});

    if (typeof window !== "undefined") {
      localStorage.removeItem("vita_link_token");
      localStorage.removeItem("vita_link_user");
    }
  },
};