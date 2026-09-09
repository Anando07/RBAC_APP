import axios from "axios";
import type RegisterData from "@/models/RegisterData";
import apiClient from "@/config/apiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";

const BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:8082/api/v1";

// register function
export const registerUser = async (signupData: RegisterData) => {
  const response = await apiClient.post(`/auth/register`, signupData);
  return response.data;
};

// login
export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>(
    "/auth/login",
    loginData
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post(`/auth/logout`);
  return response.data;
};

// get current login user
export const getCurrentUser = async (emailId: string | undefined) => {
  const response = await apiClient.get<User>(`/users/email/${emailId}`);
  return response.data;
};

// refresh token - Use raw axios directly to avoid interceptor loops
export const refreshToken = async () => {
  const response = await axios.post<LoginResponseData>(
    `${BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true } // Ensures cookie with refresh token is sent to backend
  );
  return response.data;
};