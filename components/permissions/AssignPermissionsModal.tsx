"use client";

import { useState, useEffect } from "react";
import { Permission } from "@/types/permission";

interface AssignPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  allPermissions: Permission[];
  assignedPermissionIds: string[];
  onSave: (selectedIds: string[]) => void;
}

export default function AssignPermissionsModal({
  isOpen,
  onClose,
  roleName,
  allPermissions,
  assignedPermissionIds,
  onSave,
}: AssignPermissionsModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(assignedPermissionIds);
  }, [assignedPermissionIds, isOpen]);

  if (!isOpen) return null;

  const togglePermission = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((pId) => pId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = () => {
    onSave(selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-2xl text-white shadow-2xl max-h-[85vh] flex flex-col">
        <div className="border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-xl font-bold text-slate-100">
            Assign Permissions -{" "}
            <span className="text-sky-400">{roleName}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select the permissions to grant for this role
          </p>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
          {allPermissions.map((perm) => (
            <label
              key={perm.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedIds.includes(perm.id)
                  ? "bg-sky-950/30 border-sky-500/50"
                  : "bg-slate-800/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
                className="mt-1 h-4 w-4 rounded border-slate-700 text-sky-600 focus:ring-sky-500 bg-slate-800"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {perm.name}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ({perm.code})
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {perm.description}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
