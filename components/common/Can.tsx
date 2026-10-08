"use client";
import React from "react";

interface CanProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function Can({
  permission,
  children,
  fallback = null,
}: CanProps) {
  // Me thanata oyage AuthContext / usePermissions hook eken userge permissions check karanna puluwan
  const userPermissions: string[] =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("permissions") || "[]")
      : [];

  const hasPermission =
    userPermissions.includes(permission) ||
    userPermissions.includes("super-admin");

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
