import apiClient from "@/lib/api/client";
import { Alert } from "@/types";

export interface DashboardKPIs {
  pendingRequests: number;
  criticalStocks: number;
  activeAlerts: number;
  totalDonations: number;
}

export interface DashboardBloodStock {
  bloodType: string;
  quantity: number;
  level: "CRITICAL" | "LOW" | "ADEQUATE" | "SURPLUS";
}

export interface DashboardRecentRequest {
  id: string;
  bloodType: string;
  quantityNeeded: number;
  requestingHospital: {
    id: string;
    name: string;
  };
}

export interface DashboardData {
  kpis: DashboardKPIs;
  bloodStocks: DashboardBloodStock[];
  recentRequests: DashboardRecentRequest[];
}

interface DashboardApiResponse {
  success: boolean;
  dashboard: DashboardData;
}

export const dashboardService = {
  /**
   * Dashboard CNTS
   */
 async getDashboard(): Promise<DashboardData> {
  const { data } = await apiClient.get("/dashboard/cnts");

  return data?.dashboard ?? {
    kpis: {
      pendingRequests: 0,
      criticalStocks: 0,
      activeAlerts: 0,
      totalDonations: 0,
    },
    bloodStocks: [],
    recentRequests: [],
  };
},

  /**
   * Alertes récentes
   */
  async getAlerts(limit = 10): Promise<Alert[]> {
    const { data } = await apiClient.get(
      `/alerts/my-structure?limit=${limit}`
    );

    // Si ton backend renvoie directement un tableau
    if (Array.isArray(data)) {
      return data;
    }

    // Si ton backend renvoie { alerts: [...] }
    if (Array.isArray(data.alerts)) {
      return data.alerts;
    }

    // Si ton backend renvoie { data: [...] }
    if (Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  },

  /**
   * Fermer une alerte
   */
  async markAlertRead(alertId: string): Promise<void> {
    await apiClient.patch(`/alerts/${alertId}/close`);
  },
};