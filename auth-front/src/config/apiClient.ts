import useAuth from "@/auth/store";
import { refreshToken } from "@/services/AuthService";
import axios, { AxiosHeaders } from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_AUTH_API_BASE_URL ||
    import.meta.env.AUTH_API_BASE_URL ||
    "http://localhost:8082/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

function getBackendErrorMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) {
    return data;
  }
  if (data && typeof data === "object") {
    const responseData = data as { message?: unknown; error?: unknown };
    const message = responseData.message ?? responseData.error;
    return typeof message === "string" && message.trim() ? message : undefined;
  }
  return undefined;
}

// Attach Authorization before sending request
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().accessToken;

  if (accessToken) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Important: for multipart file uploads, do not set Content-Type manually
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }

  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function queueRequest(cb: (token: string | null) => void) {
  pendingQueue.push(cb);
}

function resolveQueue(newToken: string | null) {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
}

// Response interceptor: handles 401 & token rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      toast.error("Network error. Please check backend server status.");
      return Promise.reject(error);
    }

    const is401 = error.response.status === 401;
    const isAuthRoute = originalRequest.url?.includes("/auth/");

    if (!is401 || originalRequest._retry || isAuthRoute) {
      if (!isAuthRoute) {
        const message = getBackendErrorMessage(error);
        if (message) {
          toast.error(message);
        }
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueRequest((newToken: string | null) => {
          if (!newToken) {
            return reject(error);
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const loginResponse = await refreshToken();
      const newToken = loginResponse.accessToken;

      if (!newToken) {
        throw new Error("No access token provided in refresh payload.");
      }

      useAuth
        .getState()
        .changeLocalLoginData(
          loginResponse.accessToken,
          loginResponse.user,
          true
        );

      resolveQueue(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      resolveQueue(null);
      await useAuth.getState().logout(true);
      toast.error("Session expired. Please log in again.");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;