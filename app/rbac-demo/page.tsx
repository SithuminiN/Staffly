"use client";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const ROLE_PERMISSIONS = {
  Admin: ["users.view", "users.create", "users.delete"],
  Manager: ["users.view", "users.create"],
  Employee: ["users.view"],
};

function DemoContent() {
  const { userRole, setUserRole } = useAuth();
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  const hasPermission = (p) => userPermissions.includes(p);

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen text-white space-y-6">
      <h1 className="text-3xl font-bold">RBAC Demo</h1>
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between">
        <span className="text-sky-400 font-bold">{userRole}</span>
        <div className="flex gap-2">
          {["Admin", "Manager", "Employee"].map((role) => (
            <button key={role} onClick={() => setUserRole(role)} className={`px-3 py-1.5 rounded-lg text-xs ${userRole === role? "bg-sky-600" : "bg-slate-800"}`}>Switch to {role}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        {hasPermission("users.view") && <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm">View</button>}
        {hasPermission("users.create") && <button className="px-4 py-2 bg-emerald-600 rounded-lg text-sm">Create</button>}
        {hasPermission("users.delete")? <button className="px-4 py-2 bg-red-600 rounded-lg text-sm">Delete</button> : <button disabled className="px-4 py-2 bg-red-600/30 opacity-50 rounded-lg text-sm">Delete (No Access)</button>}
      </div>
    </div>
  );
}

export default function RbacDemoPage() {
  return <AuthProvider><DemoContent /></AuthProvider>;
}