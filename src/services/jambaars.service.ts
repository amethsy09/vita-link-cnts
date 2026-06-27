import apiClient from "@/lib/api/client";
import { Jambaar, PaginatedResponse } from "@/types";

export interface JambaarFilters {
  page?: number;
  limit?: number;
  status?: string;
  bloodGroup?: string;
  region?: string;
  search?: string;
}

export const jambaarService = {
  async getAll(filters: JambaarFilters = {}): Promise<PaginatedResponse<Jambaar>> {
    const { data } = await apiClient.get("/cnts/jambaars", { params: filters });
    return data;
  },

  async getById(id: string): Promise<Jambaar> {
    const { data } = await apiClient.get(`/cnts/jambaars/${id}`);
    return data;
  },

  async suspend(id: string, reason: string): Promise<Jambaar> {
    const { data } = await apiClient.patch(`/cnts/jambaars/${id}/suspend`, { reason });
    return data;
  },

  async activate(id: string): Promise<Jambaar> {
    const { data } = await apiClient.patch(`/cnts/jambaars/${id}/activate`);
    return data;
  },

  async notifyNearby(bloodGroup: string, radiusKm: number): Promise<{ notified: number }> {
    const { data } = await apiClient.post("/cnts/jambaars/notify", { bloodGroup, radiusKm });
    return data;
  },

  async getStats(): Promise<{ total: number; active: number; byBloodGroup: Record<string, number> }> {
    const { data } = await apiClient.get("/cnts/jambaars/stats");
    return data;
  },
};
