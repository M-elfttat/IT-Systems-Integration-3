import { apiClient } from "./apiClient";

export const adminService = {
  dashboard: async () => (await apiClient.get("/api/admin/dashboard")).data,
  addDoctor: async (payload) => (await apiClient.post("/api/admin/doctors", payload)).data,
  listAppointments: async (status) => (await apiClient.get("/api/admin/appointments", { params: status ? { status } : {} })).data,
  updateAppointment: async (appointmentId, payload) =>
    (await apiClient.patch(`/api/admin/appointments/${appointmentId}`, payload)).data,
  listPatients: async () => (await apiClient.get("/api/admin/patients")).data,
  listPayments: async () => (await apiClient.get("/api/admin/payments")).data,
  activity: async () => (await apiClient.get("/api/admin/activity")).data,
};
