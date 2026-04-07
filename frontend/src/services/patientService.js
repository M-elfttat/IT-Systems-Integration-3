import { apiClient } from "./apiClient";

export const patientService = {
  dashboard: async () => (await apiClient.get("/api/patients/dashboard")).data,
  profile: async () => (await apiClient.get("/api/auth/me")).data,
};
