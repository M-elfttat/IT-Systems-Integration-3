import { apiClient } from "./apiClient";

export const appointmentService = {
  create: async (payload) => (await apiClient.post("/api/patients/appointments", payload)).data,
  listMine: async (status) => (await apiClient.get("/api/patients/appointments", { params: status ? { status } : {} })).data,
  updateMine: async (appointmentId, payload) =>
    (await apiClient.patch(`/api/patients/appointments/${appointmentId}`, payload)).data,
};
