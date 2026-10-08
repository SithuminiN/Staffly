"use client";

import React, { useState, useEffect } from "react";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // නව Role එකක් සෑදීම සඳහා Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Backend එකෙන් Roles ලබාගැනීම (GET Request)
  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/roles", {
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
        setError("මෙම පිටුවට පිවිසීමට අවසර නැත (403 Forbidden).");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("රෝල්ස් දත්ත ලබාගැනීමේ දෝෂයක් ඇති විය.");

      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setRoles(result.data);
      } else {
        setRoles([]);
      }
    } catch (err: any) {
      setError(err.message || "සර්වර් එක සමඟ සම්බන්ධ වීමට නොහැකි විය.");
    } finally {
      setLoading(false);
    }
  }

  // 2. නව Role එකක් Backend එකට යැවීම (POST API Request)
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "රෝල් එක සෑදීම අසාර්ථක විය.");
      }

      if (result.success) {
        // අලුතින් සාදන ලද role එක state එකට එකතු කිරීම
        setRoles((prevRoles) => [...prevRoles, result.data]);
        setName("");
        setDescription("");
      }
    } catch (err: any) {
      alert(err.message || "දෝෂයක් ඇති විය.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">පූරණය වෙමින් පවතී...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Role Management</h1>

      {/* නව Role එකක් ඇතුළත් කිරීමේ Form එක */}
      <form
        onSubmit={handleCreateRole}
        className="bg-white p-6 shadow-md rounded-lg mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Create New Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Role Name (e.g. Moderator)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:bg-gray-400"
        >
          {isSubmitting ? "Saving..." : "Add Role"}
        </button>
      </form>

      {/* Roles ලැයිස්තුව පෙන්වන වගුව */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {roles.length === 0 ? (
          <div className="p-6 text-center text-gray-500">රෝල්ස් හමුවී නැත.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                <th className="py-3 px-6">Role Name</th>
                <th className="py-3 px-6">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {role.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {role.description || "No description"}
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
