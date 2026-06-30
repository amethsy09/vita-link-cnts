export interface User {
  id: string;
  name: string;
  email: string;
  role: "cnts_admin" | "cnts_tech" | "super_admin";
  avatar?: string;
}
export type StockLevel = "CRITICAL" | "LOW" | "ADEQUATE" | "SURPLUS";
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface DashboardBloodStock {
  bloodType: string;
  quantity: number;
  level: StockLevel;
}


// export interface Structure {
//   id: string;
//   name: string;
//   type: "hopital" | "clinique" | "maternite" | "centre_sante";
//   region: string;
//   address: string;
//   phone: string;
//   email: string;
//   status: "active" | "pending" | "suspended";
//   contactPerson: string;
//   createdAt: string;
//   lastRequestAt?: string;
//   totalRequests?: number;
// }

// export interface Jambaar {
//   id: string;
//   name: string;
//   phone: string;
//   email?: string;
//   bloodGroup: string;
//   region: string;
//   latitude: number;
//   longitude: number;
//   status: "active" | "suspended" | "cooldown";
//   totalDonations: number;
//   lastDonationAt?: string;
//   points: number;
//   createdAt: string;
// }

export interface BloodRequest {
  id: string;
  structureId: string;
  structureName: string;
  bloodGroup: string;
  quantity: number;
  urgency: "critical" | "high" | "normal";
  status: "pending" | "reserved" | "in_transit" | "delivered" | "cancelled";
  requestedAt: string;
  updatedAt: string;
  notes?: string;
  assignedAgentId?: string;
  qrCode?: string;
}

export interface DashboardKPIs {
  pendingRequests: number;
  criticalStocks: number;
  activeAlerts: number;
  totalDonations: number;
}


export interface Alert {
  id: string;
  type: "critical_stock" | "urgent_request" | "new_structure" | "donor_alert" | "system";
  message: string;
  severity: "critical" | "warning" | "info";
  createdAt: string;
  read: boolean;
  relatedId?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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