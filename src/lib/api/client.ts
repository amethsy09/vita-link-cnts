import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://vita-link-api.onrender.com/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("vita_link_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("vita_link_token");
      localStorage.removeItem("vita_link_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
