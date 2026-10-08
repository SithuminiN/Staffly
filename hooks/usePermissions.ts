"use client";
import { useState, useEffect } from "react";

export function usePermission() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Backend එකෙන් ලොග් වූ යූසර්ගේ පර්මිෂන්ස් ලබාගැනීම
  useEffect(() => {
    async function fetchUserPermissions() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        // Backend එකේ employees හෝ auth endpoint එකෙන් යූසර්ගේ දත්ත ලබාගැනීම
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        const result = await res.json();

        // Backend එකෙන් එන permissions ඇරේ එක හෝ රෝල් එක සෙට් කිරීම
        if (result.success && result.data) {
          setPermissions(result.data.permissions || []);
        }
      } catch (err) {
        console.error("Error fetching permissions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPermissions();
  }, []);

  // Check if user has a specific permission
  const checkPermission = (permission: string): boolean => {
    if (permissions.includes("super-admin") || permissions.includes("Admin"))
      return true;
    return permissions.includes(permission);
  };

  // Check if user has ANY of the given permissions
  const checkAnyPermission = (requiredPermissions: string[]): boolean => {
    if (permissions.includes("super-admin") || permissions.includes("Admin"))
      return true;
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  // Check if user has ALL of the given permissions
  const checkAllPermissions = (requiredPermissions: string[]): boolean => {
    if (permissions.includes("super-admin") || permissions.includes("Admin"))
      return true;
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  return {
    permissions,
    loading,
    can: checkPermission,
    canAny: checkAnyPermission,
    canAll: checkAllPermissions,
  };
}
