"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface PermissionGuardProps {
  permission?: string;
  children: React.ReactNode;
  mode?: "hide" | "disable"; // 👈 අලුතින් එකතු කළ ප්‍රොප් එක (mode support සඳහා)
}

export default function PermissionGuard({
  permission,
  children,
  mode = "hide", // 👈 Default mode එක
}: PermissionGuardProps) {
  const router = useRouter();

  // LocalStorage එකෙන් permissions ලබා ගැනීම (නැති නම් default bypass එකක් ලෙස super-admin ලබා දී ඇත)
  const userPermissions: string[] =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("permissions") || '["super-admin"]')
      : ["super-admin"];

  // Permission එක check කිරීම (super-admin හෝ අදාළ permission එක ඇත්නම් access ලැබේ)
  const hasAccess =
    !permission ||
    userPermissions.includes(permission) ||
    userPermissions.includes("super-admin");

  // Access නැත්නම් mode එක අනුව හැසිරීම පාලනය කිරීම
  if (!hasAccess) {
    if (mode === "hide") {
      return null; // hide නම් මුළුමනින්ම ඉවත් කරයි
    }

    if (mode === "disable") {
      // disable නම් ක්ලික් කළ නොහැකි ලෙස opacity අඩු කර පෙන්වයි
      return (
        <div className="opacity-50 pointer-events-none cursor-not-allowed inline-block">
          {children}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4 text-center">
          You do not have the required permission ({permission}) to view this
          section.
        </p>
        <button
          onClick={() => router.push("/users")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
