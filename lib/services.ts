// lib/services.ts
import { User, UserPayload } from "@/types/user";
import { apiClient, ApiResult } from "./apiClient";

const API_BASE_URL = "http://localhost:8000/api"; // Oyage backend URL eka

const getHeaders = () => {
  // Token eka nathnam automatic 'dummy-token' ekak yanna hadala thiyenawa (401 error eka wadin nathi wenna)
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || "dummy-token"
      : "dummy-token";
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error("Failed to fetch users from API");
  }
  const data = await res.json();
  return data.users || data;
}

export async function createUser(payload: UserPayload): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function updateUser(
  id: string,
  payload: Partial<UserPayload>,
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
}

// --- මීට පෙර අත්‍යවශ්‍ය වූ Centralized API Services සහ Auth Me කොටස් මෙහි එකතු කර ඇත ---

// 1. Pagination සමඟ පරිශීලකයන් ලැයිස්තුව ලබා ගැනීම (apiClient හරහා)
export async function getUsersWithPagination(
  page = 1,
  limit = 10,
): Promise<ApiResult<User[]>> {
  return apiClient<User[]>(`/users?page=${page}&limit=${limit}`);
}

// 2. දැනට ලොග් වී සිටින පරිශීලකයාගේ විස්තර ලබා ගැනීම (/auth/me)
export async function getAuthMe(): Promise<ApiResult<User>> {
  return apiClient<User>("/auth/me", {
    skipAuthRedirect: true, // ලොගින් පරීක්ෂාවේදී අනවශ්‍ය රීඩිරෙක්ට් වීම් වැළැක්වීමට
  });
}
