"use client";

import React, { useState, useEffect } from "react";

interface Permission {
  id: string;
  name: string;
  module: string;
  admin: boolean;
  editor: boolean;
  user: boolean;
}

export default function PermissionPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Backend එකෙන් ඩේටා ලබාගැනීම
  useEffect(() => {
    async function fetchPermissions() {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/permissions", {
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

        if (!res.ok) throw new Error("පර්මිෂන් දත්ත ලබාගැනීමේ දෝෂයක් ඇති විය.");

        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setPermissions(result.data);
        } else {
          setPermissions([]);
        }
      } catch (err: any) {
        setError(err.message || "සර්වර් එක සමඟ සම්බන්ධ වීමට නොහැකි විය.");
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  // State mutation එක මඟහරවා, නිවැරදිව state එක update කර PUT API එක Call කිරීම
  const togglePermission = async (
    id: string,
    roleKey: "admin" | "editor" | "user",
  ) => {
    // 1. Immutable ආකාරයට අලුත් state array එකක් සෑදීම (UI re-render වීම සඳහා)
    const updatedPermissions = permissions.map((p) =>
      p.id === id ? { ...p, [roleKey]: !p[roleKey] } : p,
    );

    setPermissions(updatedPermissions);

    // 2. වෙනස් වූ අදාළ permission item එක සර්වර් එකට යැවීම
    const targetPermission = updatedPermissions.find((p) => p.id === id);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/permissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(targetPermission),
      });

      if (!res.ok) {
        console.error("පර්මිෂන් සේව් කිරීම අසාර්ථක විය.");
      }
    } catch (err) {
      console.error("Error saving permission:", err);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Permission Matrix
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">Permission Name</th>
              <th className="py-3 px-6">Module</th>
              <th className="py-3 px-6 text-center">Admin</th>
              <th className="py-3 px-6 text-center">Editor</th>
              <th className="py-3 px-6 text-center">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {permissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  පර්මිෂන් දත්ත හමුවී නැත.
                </td>
              </tr>
            ) : (
              permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {perm.name}
                  </td>
                  <td className="py-4 px-6 text-gray-500">{perm.module}</td>
                  <td className="py-4 px-6 text-center">
                    <input
                      type="checkbox"
                      checked={perm.admin}
                      onChange={() => togglePermission(perm.id, "admin")}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <input
                      type="checkbox"
                      checked={perm.editor}
                      onChange={() => togglePermission(perm.id, "editor")}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <input
                      type="checkbox"
                      checked={perm.user}
                      onChange={() => togglePermission(perm.id, "user")}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
