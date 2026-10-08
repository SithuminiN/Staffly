"use client";
import React from "react";
import { Permission } from "@/types/permission";

interface PermissionGroupCardProps {
  groupName: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onTogglePermission: (permissionName: string) => void;
  onSelectAllGroup?: (groupPermissions: string[], selectAll: boolean) => void;
}

export default function PermissionGroupCard({
  groupName,
  permissions,
  selectedPermissions,
  onTogglePermission,
  onSelectAllGroup,
}: PermissionGroupCardProps) {
  // Check if all permissions in this group are currently selected
  const groupPermNames = permissions.map((p) => p.name);
  const isAllSelected =
    groupPermNames.length > 0 &&
    groupPermNames.every((name) => selectedPermissions.includes(name));

  const handleGroupCheckboxChange = () => {
    if (onSelectAllGroup) {
      onSelectAllGroup(groupPermNames, !isAllSelected);
    } else {
      // Fallback if select all handler is not passed
      groupPermNames.forEach((name) => {
        if (isAllSelected && selectedPermissions.includes(name)) {
          onTogglePermission(name);
        } else if (!isAllSelected && !selectedPermissions.includes(name)) {
          onTogglePermission(name);
        }
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6 transition hover:shadow-md">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800 capitalize flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
          {groupName} Management
        </h3>
        {permissions.length > 0 && (
          <label className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleGroupCheckboxChange}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            Select All
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {permissions.map((permission) => {
          const isChecked = selectedPermissions.includes(permission.name);
          return (
            <label
              key={permission.id || permission.name}
              className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                isChecked
                  ? "bg-blue-50 border-blue-300 text-blue-900 shadow-sm"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onTogglePermission(permission.name)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <div className="text-sm">
                <span className="font-semibold block leading-tight">
                  {permission.name}
                </span>
                {permission.description && (
                  <span className="text-xs text-gray-500 mt-0.5 block leading-normal">
                    {permission.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
