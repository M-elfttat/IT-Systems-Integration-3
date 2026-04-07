import { apiClient } from "./apiClient";

export const paymentService = {
  create: async (payload) => (await apiClient.post("/api/payments", payload)).data,
  getByAppointment: async (appointmentId) => (await apiClient.get(`/api/payments/${appointmentId}`)).data,
};
