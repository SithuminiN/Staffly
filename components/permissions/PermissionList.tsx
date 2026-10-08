"use client";

import { Permission } from "@/types/permission";

interface PermissionListProps {
  permissions: Permission[];
}

export default function PermissionList({ permissions }: PermissionListProps) {
  // Group permissions by module
  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
        <div
          key={module}
          className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden"
        >
          <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-800">
            <h3 className="font-semibold text-sky-400 text-sm">{module}</h3>
          </div>
          <div className="divide-y divide-slate-800/60">
            {modulePermissions.map((perm) => (
              <div
                key={perm.id}
                className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium text-sm">
                      {perm.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      {perm.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {perm.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
