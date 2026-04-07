import { apiClient } from "./apiClient";

export const authService = {
  register: async (payload) => (await apiClient.post("/api/auth/register", payload)).data,
  login: async (payload) => (await apiClient.post("/api/auth/login", payload)).data,
  me: async () => (await apiClient.get("/api/auth/me")).data,
};
