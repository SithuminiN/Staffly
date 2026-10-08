"use client";

import React, { useState, useEffect } from "react";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "On Leave";
};

export default function UsersPage() {
  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Backend එකෙන් /api/employees හරහා දත්ත ලබාගැනීම
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (res.status === 403) {
          setError("මෙම පිටුවට පිවිසීමට ඔබට අවසර නැත (403 Forbidden).");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error("සේවක දත්ත ලබාගැනීමේ දෝෂයක් ඇති විය.");
        }

        const result = await res.json();

        // Backend එකේ { success: true, data: [...] } ස්ට්‍රක්චර් එකට අනුව
        if (result.success && Array.isArray(result.data)) {
          setUsers(result.data);
        } else {
          setUsers([]);
        }
      } catch (err: any) {
        setError(err.message || "සර්වර් එක සමඟ සම්බන්ධ වීමට නොහැකි විය.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">පූරණය වෙමින් පවතී...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold bg-red-50 rounded-lg m-6">
        {error}
      </div>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.department?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            සේවකයන් හමුවී නැත.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
