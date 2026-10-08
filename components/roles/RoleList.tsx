"use client";

import { Role } from "@/types/role";

interface RoleListProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

export default function RoleList({ roles, onEdit, onDelete }: RoleListProps) {
  return (
    <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/50">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800 uppercase text-xs">
          <tr>
            <th className="p-4">Role Name</th>
            <th className="p-4">Description</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {roles.map((role) => (
            <tr
              key={role.id}
              className="hover:bg-slate-800/30 transition-colors"
            >
              <td className="p-4 font-semibold text-white">{role.name}</td>
              <td className="p-4 text-slate-400">{role.description}</td>
              <td className="p-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(role)}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-md hover:bg-blue-600/30 text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(role.id)}
                  className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-md hover:bg-red-600/30 text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
