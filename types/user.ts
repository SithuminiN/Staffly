export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface RoleRef {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  status: UserStatus;
  roles: RoleRef[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  department?: string;
  status: UserStatus;
  roles: string[]; // Role IDs
}
