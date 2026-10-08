"use client";
import React, { useState, useEffect } from "react";
import { Role } from "@/types/role";
import { Permission } from "@/types/permission";
import PermissionGroupCard from "@/components/permissions/PermissionGroupCard";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    description: string;
    permissions: string[];
  }) => void;
  initialData?: Role | null;
  allPermissions: Permission[];
}

export default function RoleFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  allPermissions,
}: RoleFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setSelectedPermissions(initialData.permissions || []);
    } else {
      setName("");
      setDescription("");
      setSelectedPermissions([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Toggle single permission
  const handleTogglePermission = (permName: string) => {
    if (selectedPermissions.includes(permName)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permName));
    } else {
      setSelectedPermissions([...selectedPermissions, permName]);
    }
  };

  // Select or Deselect all permissions in a specific group
  const handleSelectAllGroup = (
    groupPermNames: string[],
    selectAll: boolean,
  ) => {
    if (selectAll) {
      // Add all group permissions without duplicates
      const updated = Array.from(
        new Set([...selectedPermissions, ...groupPermNames]),
      );
      setSelectedPermissions(updated);
    } else {
      // Remove all group permissions
      setSelectedPermissions(
        selectedPermissions.filter((p) => !groupPermNames.includes(p)),
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      permissions: selectedPermissions,
    });
  };

  // Group permissions by their 'group' property
  const groupedPermissions = allPermissions.reduce(
    (acc, permission) => {
      const group = permission.group || "General";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Role" : "Add New Role"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Role Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Administrator, Editor"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Brief description of the role responsibilities"
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Assign Permissions by Group
            </label>
            {Object.keys(groupedPermissions).length === 0 ? (
              <p className="text-sm text-gray-500">No permissions available.</p>
            ) : (
              Object.entries(groupedPermissions).map(([groupName, perms]) => (
                <PermissionGroupCard
                  key={groupName}
                  groupName={groupName}
                  permissions={perms}
                  selectedPermissions={selectedPermissions}
                  onTogglePermission={handleTogglePermission}
                  onSelectAllGroup={handleSelectAllGroup}
                />
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
