import type Role from "./Role";

export default interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  enable?: boolean;   // Backend JSON property
  enabled?: boolean;  // Frontend standardized property
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
  roles?: Role[];
}