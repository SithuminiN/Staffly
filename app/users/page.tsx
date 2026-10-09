"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "On Leave";
  canEdit?: boolean; // optional per-record flags from backend
  canDelete?: boolean;
};

type FieldError = { field: string; message: string };
type Meta = { page: number; limit: number; total: number; totalPages: number };

const API = "http://localhost:5000/api/employees";
const LIMIT = 10;
const DEPARTMENTS = ["IT", "HR", "Finance", "Operations"];
const EMPTY_FORM = {
  name: "",
  email: "",
  department: DEPARTMENTS[0],
  role: "",
  status: "Active" as Employee["status"],
};

// Shared request helper: handles token, 401 redirect, 403 and field errors
async function request(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("401");
  }
  if (res.status === 403) {
    throw new Error("මෙම ක්‍රියාවට ඔබට අවසර නැත (403 Forbidden).");
  }

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(result.message || "ඉල්ලීම අසාර්ථක විය.");
    err.fields = result.errors || [];
    throw err;
  }
  return result;
}

export default function UsersPage() {
  const { hasPermission } = useAuth();

  // List state
  const [users, setUsers] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Search / filter / pagination
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebounce(search);

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [details, setDetails] = useState<Employee | null>(null);

  // Authorization UX (backend per-record flags win, permissions are fallback)
  const canCreate = hasPermission("users.create");
  const canEdit = (e: Employee) => e.canEdit ?? hasPermission("users.edit");
  const canDelete = (e: Employee) =>
    e.canDelete ?? hasPermission("users.delete");

  const reload = () => setReloadKey((k) => k + 1);

  // Fetch list from backend with query params
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
        });
        if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
        if (department) params.set("department", department);
        if (status) params.set("status", status);

        const result = await request(`${API}?${params}`);
        if (cancelled) return;
        if (result.success && Array.isArray(result.data)) {
          setUsers(result.data);
          setMeta(result.meta || null);
        } else {
          setUsers([]);
          setMeta(null);
        }
      } catch (err: any) {
        if (!cancelled && err.message !== "401") {
          setError(err.message || "සර්වර් එක සමඟ සම්බන්ධ වීමට නොහැකි විය.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, department, status, reloadKey]);

  // Reset to page 1 when search/filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, status]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setFieldErrors([]);
    setFormOpen(true);
  };

  const openEdit = (u: Employee) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      department: u.department,
      role: u.role,
      status: u.status,
    });
    setFormError("");
    setFieldErrors([]);
    setFormOpen(true);
  };

  const openDetails = async (u: Employee) => {
    setDetails(u);
    try {
      const result = await request(`${API}/${u.id}`);
      if (result.data) setDetails(result.data);
    } catch {
      /* keep list data */
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setFieldErrors([]);
    try {
      await request(editing ? `${API}/${editing.id}` : API, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setFormOpen(false);
      reload();
    } catch (err: any) {
      setFormError(err.message);
      setFieldErrors(err.fields || []);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u: Employee) => {
    if (!window.confirm(`${u.name} මකා දැමීමට අවශ්‍යද?`)) return;
    setActionError(null);
    try {
      await request(`${API}/${u.id}`, { method: "DELETE" });
      if (users.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const fieldErr = useCallback(
    (f: string) => fieldErrors.find((x) => x.field === f)?.message,
    [fieldErrors],
  );

  const hasFilters = !!(debouncedSearch || department || status);
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
        {canCreate && (
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Employee
          </button>
        )}
      </div>

      {/* Search + filters (stay mounted while list is loading) */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name, email or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>On Leave</option>
        </select>
        {(search || department || status) && (
          <button
            onClick={() => {
              setSearch("");
              setDepartment("");
              setStatus("");
            }}
            className="px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {actionError && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {actionError}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">පූරණය වෙමින් පවතී...</div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-600 font-semibold mb-3">{error}</p>
            <button
              onClick={reload}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {hasFilters
              ? "ගැලපෙන සේවකයන් හමුවී නැත. සෙවුම් / ෆිල්ටර් වෙනස් කරන්න."
              : "සේවකයන් හමුවී නැත."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Department</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-gray-600">{user.department}</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetails(user)}
                          className="text-xs px-3 py-1 border rounded hover:bg-gray-50"
                        >
                          View
                        </button>
                        {canEdit(user) && (
                          <button
                            onClick={() => openEdit(user)}
                            className="text-xs px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete(user) && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && users.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Page {meta?.page ?? page} of {totalPages}
            {meta ? ` · ${meta.total} total` : ""}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSave}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl space-y-3"
          >
            <h2 className="text-xl font-bold">
              {editing ? "Edit Employee" : "Add Employee"}
            </h2>

            {formError && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                {formError}
              </div>
            )}

            {(
              [
                ["name", "Full Name", "text"],
                ["email", "Email", "email"],
                ["role", "Role", "text"],
              ] as const
            ).map(([key, label, type]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border p-2 rounded mt-1"
                />
                {fieldErr(key) && (
                  <p className="text-xs text-red-600 mt-1">{fieldErr(key)}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {fieldErr("department") && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErr("department")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Employee["status"] })
                }
                className="w-full border p-2 rounded mt-1"
              >
                <option>Active</option>
                <option>On Leave</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Details modal */}
      {details && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Employee Details</h2>
            {(
              [
                ["Name", details.name],
                ["Email", details.email],
                ["Department", details.department],
                ["Role", details.role],
                ["Status", details.status],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-2 border-b text-sm"
              >
                <span className="text-gray-500">{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
            <div className="text-right mt-4">
              <button
                onClick={() => setDetails(null)}
                className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}