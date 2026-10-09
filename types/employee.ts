export type EmployeeStatus = "Active" | "On Leave";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface EmployeePayload {
  name: string;
  email: string;
  department: string;
  role: string;
  status: EmployeeStatus;
}

export interface EmployeeQuery {
  page: number;
  limit: number;
  search?: string;
  department?: string;
  status?: string;
}