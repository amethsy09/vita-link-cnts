import apiClient from "@/lib/api/client";
import { Structure, PaginatedResponse } from "@/types";

export interface StructureFilters {
  page?: number;
  limit?: number;
  status?: string;
  region?: string;
  search?: string;
}

export const structuresService = {
  async getAll(filters: StructureFilters = {}): Promise<PaginatedResponse<Structure>> {
    const { data } = await apiClient.get("/cnts/structures", { params: filters });
    return data;
  },

  async getById(id: string): Promise<Structure> {
    const { data } = await apiClient.get(`/cnts/structures/${id}`);
    return data;
  },

  async validate(id: string): Promise<Structure> {
    const { data } = await apiClient.patch(`/cnts/structures/${id}/validate`);
    return data;
  },

  async suspend(id: string, reason: string): Promise<Structure> {
    const { data } = await apiClient.patch(`/cnts/structures/${id}/suspend`, { reason });
    return data;
  },

  async getPending(): Promise<Structure[]> {
    const { data } = await apiClient.get("/cnts/structures/pending");
    return data;
  },
};
