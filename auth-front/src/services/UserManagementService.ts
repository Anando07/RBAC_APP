import apiClient from "@/config/apiClient";
import type User from "@/models/User";
import type Role from "@/models/Role";

export type UserMutation = Partial<User> & {
  password?: string;
};

export const normalizeUser = (data: User): User => ({
  ...data,
  id: String(data.id),
  name: data.name ?? "",
  email: data.email ?? "",
  roles: Array.isArray(data.roles)
    ? data.roles.map((role) => ({
        ...role,
        id: String(role.id),
        name: (role.name ?? "").toString().trim().toUpperCase(),
      }))
    : [],
  enabled: data.enabled ?? data.enable ?? true,
});

const preparePayload = (user: UserMutation) => {
  const { enabled, enable, roles, ...rest } = user;

  const normalizedRoles = Array.isArray(roles)
    ? roles.map((role) => ({
        id: role?.id ? String(role.id) : undefined,
        name: (role?.name ?? "")
          .toString()
          .trim()
          .toUpperCase()
          .replace(/^ROLE_/, ""),
      }))
    : [];

  const payload: Record<string, unknown> = {
    ...rest,
    enable: enabled ?? enable ?? true,
  };

  if (normalizedRoles.length > 0) {
    payload.roles = normalizedRoles;
  }

  return payload;
};

export const uploadUserImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<{ url: string }>("/files/upload", formData);
  return response.data.url;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>("/users");
  return response.data.map(normalizeUser);
};

export const createUser = async (userData: UserMutation): Promise<User> => {
  const payload = preparePayload(userData);
  const response = await apiClient.post<User>("/users", payload);
  return normalizeUser(response.data);
};

export const updateUser = async (
  id: string,
  userData: UserMutation
): Promise<User> => {
  const payload = preparePayload(userData);
  const response = await apiClient.put<User>(`/users/${id}`, payload);
  return normalizeUser(response.data);
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await apiClient.get<Role[]>("/roles");
  const roleData = Array.isArray(response.data)
    ? response.data
    : ((response.data as unknown as { content?: Role[] }).content ?? []);

  return roleData
    .filter((role) => role?.id && role?.name)
    .map((role) => ({
      ...role,
      id: String(role.id),
      name: (role.name ?? "").toString().trim().toUpperCase(),
    }));
};