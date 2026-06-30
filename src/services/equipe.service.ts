import apiClient from "@/lib/api/client";

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  isStructureAdmin: boolean;
}

export interface StaffMember {
  id: string;
  firstName: string;
  email: string;
  isStructureAdmin: boolean;
}

export interface StaffResponse {
  success: boolean;
  staff: StaffMember[];
}

export const equipeService = {
  // GET STAFF
  async getStaff(): Promise<StaffResponse> {
    const { data } = await apiClient.get(
      "/health-structures/me/staff"
    );
    return data;
  },

  // CREATE STAFF
  async createStaff(payload: CreateStaffPayload) {
    const { data } = await apiClient.post(
      "/health-structures/me/staff",
      payload
    );
    return data;
  },
};