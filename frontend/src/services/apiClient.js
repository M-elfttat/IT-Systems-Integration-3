import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { tokenStorage } from "../utils/tokenStorage";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) tokenStorage.clearAll();
    return Promise.reject(error);
  }
);
