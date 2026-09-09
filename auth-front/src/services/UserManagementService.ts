import apiClient from "@/config/apiClient";
import type User from "@/models/User";

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>("/users");
  return response.data;
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${userId}`);
  return response.data;
};

// Get user by Email
export const getUserByEmail = async (email: string): Promise<User> => {
  const response = await apiClient.get<User>(`/users/email/${email}`);
  return response.data;
};

// Create new user
export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await apiClient.post<User>("/users", userData);
  return response.data;
};

// Update existing user
export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${userId}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};