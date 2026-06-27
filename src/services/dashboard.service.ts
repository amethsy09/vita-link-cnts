import apiClient from "@/lib/api/client";
import { DashboardStats, Alert, BloodStock } from "@/types";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get("/dashboard/cnts");
    return data;
  },

  async getAlerts(): Promise<Alert[]> {
    const { data } = await apiClient.get("/admin/alerts/recent");
    return data;
  },

  async markAlertRead(alertId: string): Promise<void> {
    await apiClient.patch(`/alerts/${alertId}/close`);
  },

  async getStocks(): Promise<BloodStock[]> {
    const { data } = await apiClient.get("/blood-stocks");
    return data;
  },

  async updateStock(
    bloodType: string,
    quantity: number
  ): Promise<BloodStock> {
    const { data } = await apiClient.patch("/blood-stocks/me", {
      bloodType,
      quantity,
    });

    return data;
  },
};