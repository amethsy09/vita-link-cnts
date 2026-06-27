import apiClient from "@/lib/api/client";
import { BloodRequest, PaginatedResponse } from "@/types";

export interface RequestFilters {
  page?: number;
  limit?: number;
  status?: string;
  bloodGroup?: string;
  urgency?: string;
}

export const requestsService = {
  async getAll(filters: RequestFilters = {}): Promise<PaginatedResponse<BloodRequest>> {
    const { data } = await apiClient.get("/cnts/requests", { params: filters });
    return data;
  },

  async getById(id: string): Promise<BloodRequest> {
    const { data } = await apiClient.get(`/cnts/requests/${id}`);
    return data;
  },

  async reserve(id: string): Promise<BloodRequest> {
    const { data } = await apiClient.patch(`/cnts/requests/${id}/reserve`);
    return data;
  },

  async generateQrCode(id: string): Promise<{ qrCode: string }> {
    const { data } = await apiClient.post(`/cnts/requests/${id}/qrcode`);
    return data;
  },

  async markDelivered(id: string): Promise<BloodRequest> {
    const { data } = await apiClient.patch(`/cnts/requests/${id}/deliver`);
    return data;
  },

  async cancel(id: string, reason: string): Promise<BloodRequest> {
    const { data } = await apiClient.patch(`/cnts/requests/${id}/cancel`, { reason });
    return data;
  },
};
