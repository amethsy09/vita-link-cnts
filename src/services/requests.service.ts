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
  // 📥 LISTE
  async getAll(filters: RequestFilters = {}): Promise<PaginatedResponse<BloodRequest>> {
    const { data } = await apiClient.get("/blood-requests", {
      params: filters,
    });
    
    // console.log(data);
    return data;
  },

  // 📄 DÉTAIL
  async getById(id: string): Promise<BloodRequest> {
    const { data } = await apiClient.get(`/blood-requests/${id}`);
    return data;
  },

  // 🩸 CRÉER UNE DEMANDE
  async create(payload: Partial<BloodRequest>): Promise<BloodRequest> {
    const { data } = await apiClient.post("/blood-requests", payload);
    return data;
  },

  // ⚙️ TRAITER (CNTS)
  async handle(id: string): Promise<BloodRequest> {
    const { data } = await apiClient.post(`/blood-requests/${id}/handle`);
    return data;
  },

  // ❌ ANNULER
  async cancel(id: string): Promise<BloodRequest> {
    const { data } = await apiClient.patch(`/blood-requests/${id}/cancel`);
    return data;
  },
};