"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import PermissionGuard from "@/components/common/PermissionGuard";

function DemoContent() {
  const { userRole, setUserRole, userPermissions } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen text-white space-y-6">
      {/* Page Title & Header */}
      <div>
        <h1 className="text-3xl font-bold">RBAC-Aware Actions Demo</h1>
        <p className="text-slate-400 text-sm mt-1">
          Dynamic UI controls based on active user permissions
        </p>
      </div>

      {/* Role Switcher */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase text-slate-400 font-semibold block">
            Current Active Role
          </span>
          <span className="text-lg font-bold text-sky-400">{userRole}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Admin", "Manager", "Employee"].map((role) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                userRole === role
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Switch to {role}
            </button>
          ))}
        </div>
      </div>

      {/* Active Permissions List */}
      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">
          Active Permissions for {userRole}:
        </h3>
        <div className="flex flex-wrap gap-2">
          {userPermissions && userPermissions.length > 0 ? (
            userPermissions.map((p: string) => (
              <span
                key={p}
                className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-xs font-mono text-sky-300 rounded-md"
              >
                {p}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">
              No permissions assigned
            </span>
          )}
        </div>
      </div>

      {/* RBAC Action Buttons Demonstration */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-lg font-bold text-slate-200">User Actions</h2>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Always Visible Action (users.view) */}
          <PermissionGuard permission="users.view">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm rounded-lg font-medium transition-colors">
              👁️ View Details (users.view)
            </button>
          </PermissionGuard>

          {/* Hidden Action when no permission (users.create) */}
          <PermissionGuard permission="users.create" mode="hide">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg font-medium shadow-md shadow-emerald-600/20 transition-colors">
              + Create User (users.create)
            </button>
          </PermissionGuard>

          {/* Disabled Action when no permission (users.delete) */}
          <PermissionGuard permission="users.delete" mode="disable">
            <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg font-medium shadow-md shadow-red-600/20 transition-colors">
              🗑️ Delete User (users.delete)
            </button>
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
}

export default function RbacDemoPage() {
  return (
    <AuthProvider>
      <DemoContent />
    </AuthProvider>
  );
}
