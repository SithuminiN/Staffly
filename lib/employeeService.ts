import { apiClient } from "@/lib/apiClient";
import { Employee, EmployeePayload, EmployeeQuery } from "@/types/employee";

export function listEmployees(q: EmployeeQuery) {
  const params = new URLSearchParams({
    page: String(q.page),
    limit: String(q.limit),
  });
  if (q.search) params.set("search", q.search);
  if (q.department) params.set("department", q.department);
  if (q.status) params.set("status", q.status);
  return apiClient<Employee[]>(`/employees?${params.toString()}`);
}

export const getEmployee = (id: string) =>
  apiClient<Employee>(`/employees/${id}`);

export const createEmployee = (body: EmployeePayload) =>
  apiClient<Employee>("/employees", { method: "POST", body });

export const updateEmployee = (id: string, body: EmployeePayload) =>
  apiClient<Employee>(`/employees/${id}`, { method: "PUT", body });

export const deleteEmployee = (id: string) =>
  apiClient<null>(`/employees/${id}`, { method: "DELETE" });