import { apiClient } from "./apiClient";

export const doctorService = {
  list: async (params = {}) => (await apiClient.get("/api/doctors", { params })).data,
  detail: async (doctorId) => (await apiClient.get(`/api/doctors/${doctorId}`)).data,
  upsertProfile: async (payload) => (await apiClient.post("/api/doctors/profile", payload)).data,
  myAppointments: async () => (await apiClient.get("/api/doctors/me/appointments")).data,
  myPatients: async () => (await apiClient.get("/api/doctors/me/patients")).data,
};
