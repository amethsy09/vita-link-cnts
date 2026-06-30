import apiClient from "@/lib/api/client";

export interface StockDTO {
  id: string;
  bloodType:
    | "A_POS"
    | "A_NEG"
    | "B_POS"
    | "B_NEG"
    | "AB_POS"
    | "AB_NEG"
    | "O_POS"
    | "O_NEG";
  quantity: number;
  level: "CRITICAL" | "LOW" | "ADEQUATE" | "SURPLUS";
  updatedAt: string;
}

export const stocksService = {
async getAll(): Promise<StockDTO[]> {
  try {
    const { data } = await apiClient.get("/blood-stocks/me");

    return (
      data?.stocks ??
      data?.data?.stocks ??
      data?.data ??
      data ??
      []
    );
  } catch (error) {
    console.error("getAll stocks error:", error);
    return [];
  }
},
  async update(bloodType: string, quantity: number) {
    const { data } = await apiClient.patch("/blood-stocks/me", {
      bloodType,
      quantity,
    });

    return data;
  },
};
