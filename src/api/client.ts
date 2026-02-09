import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail: string }>) => {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Ocurrió un error inesperado";

    toast.error(message);

    return Promise.reject(error);
  }
);
