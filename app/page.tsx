"use client";

import React, { useMemo, useState } from "react";

type Role =
  | "Admin"
  | "Manager"
  | "Staff"
  | "Super Admin"
  | "HR Manager"
  | "Team Leader"
  | "Employee"
  | "Auditor";
type Permission =
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "roles.view"
  | "roles.manage"
  | "permissions.view"
  | "permissions.assign"
  | "departments.view"
  | "departments.manage";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: "Active" | "Inactive";
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Sithumini Navodya",
    email: "sithumini@example.com",
    role: "Admin",
    department: "IT",
    status: "Active",
  },
  {
    id: 2,
    name: "Amaya Perera",
    email: "amaya@example.com",
    role: "Manager",
    department: "HR",
    status: "Active",
  },
  {
    id: 3,
    name: "Kasun Silva",
    email: "kasun@example.com",
    role: "Staff",
    department: "Finance",
    status: "Active",
  },
  {
    id: 4,
    name: "Dilini Jayawardena",
    email: "dilini@example.com",
    role: "Staff",
    department: "Operations",
    status: "Inactive",
  },
];

const rolePermissions: Record<Role, Permission[]> = {
  Admin: [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "roles.view",
    "roles.manage",
    "permissions.view",
    "permissions.assign",
    "departments.view",
    "departments.manage",
  ],
  Manager: [
    "users.view",
    "users.create",
    "users.edit",
    "roles.view",
    "permissions.view",
    "departments.view",
  ],
  Staff: ["users.view", "departments.view"],
  "Super Admin": [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "roles.view",
    "roles.manage",
    "permissions.view",
    "permissions.assign",
    "departments.view",
    "departments.manage",
  ],
  "HR Manager": [
    "users.view",
    "users.create",
    "users.edit",
    "roles.view",
    "departments.view",
  ],
  "Team Leader": ["users.view", "departments.view"],
  Employee: ["users.view"],
  Auditor: ["users.view", "roles.view", "permissions.view", "departments.view"],
};

const permissionLabels: Record<Permission, string> = {
  "users.view": "View Users",
  "users.create": "Create Users",
  "users.edit": "Edit Users",
  "users.delete": "Delete Users",
  "roles.view": "View Roles",
  "roles.manage": "Manage Roles",
  "permissions.view": "View Permissions",
  "permissions.assign": "Assign Permissions",
  "departments.view": "View Departments",
  "departments.manage": "Manage Departments",
};

const permissionGroups = [
  {
    title: "User Management",
    items: [
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
    ] as Permission[],
  },
  {
    title: "Role Management",
    items: ["roles.view", "roles.manage"] as Permission[],
  },
  {
    title: "Permission Management",
    items: ["permissions.view", "permissions.assign"] as Permission[],
  },
  {
    title: "Department Management",
    items: ["departments.view", "departments.manage"] as Permission[],
  },
];

const departments = ["IT", "HR", "Finance", "Operations"];

const responsiveCss = `
  @media (max-width: 1024px) {
    .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
    .grid-3 { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 768px) {
    .app-page { flex-direction: column !important; }
    .app-sidebar { width: 100% !important; min-height: auto !important; flex-direction: row !important; align-items: center; overflow-x: auto; padding: 12px !important; gap: 6px; }
    .app-sidebar button { width: auto !important; white-space: nowrap; flex-shrink: 0; margin-bottom: 0 !important; }
    .app-sidebar .brand-box { border-bottom: none !important; margin: 0 !important; padding: 0 10px 0 0 !important; flex-shrink: 0; }
    .app-sidebar .hide-mobile { display: none !important; }
    .app-content { padding: 16px !important; }
    .app-header, .card-header { flex-direction: column !important; align-items: flex-start !important; }
    .grid-2 { grid-template-columns: 1fr !important; }
    .grid-4 { grid-template-columns: 1fr !important; }
    .card-header input { width: 100% !important; }
  }
`;

const C = {
  primary: "#0ea5e9",
  primaryDark: "#0369a1",
  soft: "#e0f2fe",
  softer: "#f0f9ff",
  border: "#bae6fd",
  line: "#e0f2fe",
  text: "#0c4a6e",
  muted: "#64748b",
  faint: "#94a3b8",
  white: "#ffffff",
  bg: "#f5fbff",
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("Admin");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [authorizationMessage, setAuthorizationMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Staff" as Role,
    department: "Operations",
    status: "Active" as "Active" | "Inactive",
  });

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
  });

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const activeCount = users.filter((u) => u.status === "Active").length;
  const deptSummary = departments.map((d) => {
    const members = users.filter((u) => u.department === d);
    return {
      name: d,
      total: members.length,
      active: members.filter((u) => u.status === "Active").length,
    };
  });
  const maxDept = Math.max(1, ...deptSummary.map((d) => d.total));

  const currentPermissions = rolePermissions[selectedRole] || [];
  const hasPermission = (p: Permission) => currentPermissions.includes(p);

  const openAddUser = () => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      role: "Staff",
      department: "Operations",
      status: "Active",
    });
    setShowUserModal(true);
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
    });
    setShowUserModal(true);
  };

  const saveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingUser) {
      setUsers((cur) =>
        cur.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u)),
      );
    } else {
      setUsers((cur) => [...cur, { id: Date.now(), ...form }]);
    }
    setShowUserModal(false);
  };

  const deleteUser = (id: number) =>
    setUsers((cur) => cur.filter((u) => u.id !== id));

  const simulateAuthorization = (permission: Permission) => {
    setAuthorizationMessage(
      hasPermission(permission)
        ? `200 OK — ${permissionLabels[permission]} is allowed for the ${selectedRole} role.`
        : `403 Forbidden — The ${selectedRole} role does not have ${permissionLabels[permission]} permission.`,
    );
  };

  const tabs = [
    ["Dashboard", "📊"],
    ["Users", "👥"],
    ["Roles", "🛡️"],
    ["Permissions", "🔑"],
    ["RBAC Actions", "⚡"],
    ["Authorization Errors", "⚠️️"],
  ];

  return (
    <main className="app-page" style={styles.page}>
      <style>{responsiveCss}</style>
      <aside className="app-sidebar" style={styles.sidebar}>
        <div className="brand-box" style={styles.brand}>
          <div style={styles.brandIcon}>🏢</div>
          <div>
            <div style={styles.brandTitle}>Employee Management</div>
            <div style={styles.brandSub}>RBAC Management</div>
          </div>
        </div>

        <div className="hide-mobile" style={styles.navLabel}>
          ACCESS CONTROL
        </div>

        {tabs.map(([name, icon]) => (
          <button
            key={name}
            style={activeTab === name ? styles.navActive : styles.nav}
            onClick={() => setActiveTab(name)}
          >
            {icon} <span>{name}</span>
          </button>
        ))}

        <div className="hide-mobile" style={styles.sidebarBottom}>
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Logged in as</div>
            <strong>Sithumini Navodya</strong>
            <span style={styles.rolePill}>{selectedRole}</span>
          </div>
        </div>
      </aside>

      <section className="app-content" style={styles.content}>
        <header className="app-header" style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              {activeTab === "RBAC Actions" ? "RBAC-Aware Actions" : activeTab}
            </h1>
            <p style={styles.subtitle}>
              {activeTab === "Dashboard" &&
                "Overview of employees, departments and access roles."}
              {activeTab === "Users" &&
                "Build and manage users using the backend user model."}
              {activeTab === "Roles" && "Create and manage application roles."}
              {activeTab === "Permissions" &&
                "Assign permissions according to the backend permission model."}
              {activeTab === "RBAC Actions" &&
                "Show or hide actions based on the authenticated user's permissions."}
              {activeTab === "Authorization Errors" &&
                "Handle 401 and 403 authorization responses clearly and safely."}
            </p>
          </div>

          {activeTab === "Users" && hasPermission("users.create") && (
            <button style={styles.primaryButton} onClick={openAddUser}>
              + Add User
            </button>
          )}
        </header>

        {activeTab === "Dashboard" && (
          <>
            <div className="grid-4" style={styles.statsGrid}>
              <StatCard
                title="Total Employees"
                value={users.length}
                icon="👥"
              />
              <StatCard title="Active Employees" value={activeCount} icon="✓" />
              <StatCard
                title="Inactive Employees"
                value={users.length - activeCount}
                icon="⏸"
              />
              <StatCard
                title="Departments"
                value={departments.length}
                icon="🏢"
              />
            </div>

            <div className="grid-2" style={styles.dashGrid}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Department Summary</h2>
                <p style={styles.cardDescription}>
                  Employees per department and how many are active.
                </p>
                <div style={{ marginTop: "18px" }}>
                  {deptSummary.map((d) => (
                    <div key={d.name} style={styles.deptRow}>
                      <div style={styles.deptTop}>
                        <strong>{d.name}</strong>
                        <span style={styles.deptMeta}>
                          {d.total} total · {d.active} active
                        </span>
                      </div>
                      <div style={styles.barTrack}>
                        <div
                          style={{
                            ...styles.barFill,
                            width: `${(d.total / maxDept) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Role Overview</h2>
                <p style={styles.cardDescription}>
                  Employees grouped by access role.
                </p>
                <div style={styles.overviewList}>
                  {(["Admin", "Manager", "Staff"] as Role[]).map((role) => (
                    <div key={role} style={styles.overviewCard}>
                      <div style={styles.roleIcon}>
                        {role === "Admin"
                          ? "🛡️"
                          : role === "Manager"
                            ? "👔"
                            : "👤"}
                      </div>
                      <div>
                        <p style={styles.statTitle}>{role}</p>
                        <h3 style={styles.statValue}>
                          {users.filter((u) => u.role === role).length}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Recent Employees</h2>
              <p style={styles.cardDescription}>
                Latest employees added to the system.
              </p>
              <div style={{ marginTop: "12px" }}>
                {users
                  .slice(-4)
                  .reverse()
                  .map((user) => (
                    <div key={user.id} style={styles.recentRow}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>{user.name.charAt(0)}</div>
                        <div>
                          <strong style={styles.userName}>{user.name}</strong>
                          <div style={styles.email}>
                            {user.department} · {user.role}
                          </div>
                        </div>
                      </div>
                      <span
                        style={
                          user.status === "Active"
                            ? styles.activeBadge
                            : styles.inactiveBadge
                        }
                      >
                        ● {user.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "Users" && (
          <>
            <div className="grid-4" style={styles.statsGrid}>
              <StatCard title="Total Users" value={users.length} icon="👥" />
              <StatCard
                title="Active Users"
                value={users.filter((u) => u.status === "Active").length}
                icon="✓"
              />
              <StatCard
                title="Admin Users"
                value={
                  users.filter(
                    (u) => u.role === "Admin" || u.role === "Super Admin",
                  ).length
                }
                icon="🛡️"
              />
              <StatCard
                title="Available Roles"
                value={Object.keys(rolePermissions).length}
                icon="🔐"
              />
            </div>

            <div style={styles.card}>
              <div className="card-header" style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Employee Management</h2>
                  <p style={styles.cardDescription}>
                    Build and extend user management screens using backend APIs.
                  </p>
                </div>
                <input
                  style={styles.search}
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Department</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td style={styles.td}>
                          <div style={styles.userCell}>
                            <div style={styles.avatar}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <strong style={styles.userName}>
                                {user.name}
                              </strong>
                              <div style={styles.email}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>{user.department}</td>
                        <td style={styles.td}>
                          <span style={styles.roleBadge}>{user.role}</span>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={
                              user.status === "Active"
                                ? styles.activeBadge
                                : styles.inactiveBadge
                            }
                          >
                            ● {user.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actions}>
                            {hasPermission("users.edit") && (
                              <button
                                style={styles.smallButton}
                                onClick={() => openEditUser(user)}
                              >
                                Edit
                              </button>
                            )}
                            {hasPermission("users.delete") && (
                              <button
                                style={styles.deleteButton}
                                onClick={() => deleteUser(user.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "Roles" && (
          <div style={styles.card}>
            <div className="card-header" style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Role Management</h2>
                <p style={styles.cardDescription}>
                  Build and extend role management screens (Super Admin, Admin,
                  HR Manager, Team Leader, etc.).
                </p>
              </div>
              {hasPermission("roles.manage") && (
                <button
                  style={styles.primaryButton}
                  onClick={() => setShowRoleModal(true)}
                >
                  + Create Role
                </button>
              )}
            </div>

            <div className="grid-3" style={styles.roleGrid}>
              {(Object.keys(rolePermissions) as Role[]).map((role) => (
                <div
                  key={role}
                  style={{
                    ...styles.roleCard,
                    border:
                      selectedRole === role
                        ? `2px solid ${C.primary}`
                        : `1px solid ${C.border}`,
                  }}
                  onClick={() => setSelectedRole(role)}
                >
                  <div style={styles.roleIcon}>
                    {role.includes("Admin")
                      ? "🛡️"
                      : role.includes("Manager")
                        ? "👔"
                        : "👤"}
                  </div>
                  <h3 style={styles.roleName}>{role}</h3>
                  <p style={styles.roleDescription}>
                    Assigned with specific permissions for scoped access control
                    and module security.
                  </p>
                  <div style={styles.permissionCount}>
                    {rolePermissions[role].length} permissions assigned
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Permissions" && (
          <div style={styles.card}>
            <div className="card-header" style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Permission Management</h2>
                <p style={styles.cardDescription}>
                  Display and assign permissions according to the backend
                  permission model.
                </p>
              </div>

              <select
                style={styles.roleSelect}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
              >
                {Object.keys(rolePermissions).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.permissionPanel}>
              <div style={styles.selectedRoleHeader}>
                <div>
                  <span style={styles.miniLabel}>SELECTED ROLE</span>
                  <h3 style={styles.selectedRole}>{selectedRole}</h3>
                </div>
                <span style={styles.permissionTotal}>
                  {currentPermissions.length} /{" "}
                  {Object.keys(permissionLabels).length} assigned
                </span>
              </div>

              {permissionGroups.map((group) => (
                <div key={group.title} style={styles.permissionGroup}>
                  <h3 style={styles.groupTitle}>{group.title}</h3>
                  {group.items.map((permission) => {
                    const allowed = currentPermissions.includes(permission);
                    return (
                      <div key={permission} style={styles.permissionRow}>
                        <div>
                          <strong style={styles.permissionName}>
                            {permissionLabels[permission]}
                          </strong>
                          <div style={styles.permissionCode}>{permission}</div>
                        </div>
                        <button
                          style={allowed ? styles.toggleOn : styles.toggleOff}
                          onClick={() => {
                            if (!hasPermission("permissions.assign")) {
                              alert(
                                "You do not have permission to modify role permissions.",
                              );
                              return;
                            }
                            // Toggle permission locally for interactive demo
                            const updated = allowed
                              ? currentPermissions.filter(
                                  (p) => p !== permission,
                                )
                              : [...currentPermissions, permission];
                            rolePermissions[selectedRole] = updated;
                            setRolePermissionsState({ ...rolePermissions });
                          }}
                        >
                          <span
                            style={
                              allowed
                                ? styles.toggleCircleOn
                                : styles.toggleCircleOff
                            }
                          />
                          {allowed ? "Allowed" : "Denied"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "RBAC Actions" && (
          <div style={styles.card}>
            <div className="card-header" style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>RBAC-Aware Actions</h2>
                <p style={styles.cardDescription}>
                  Actions are shown, hidden or disabled according to the
                  authenticated user's permissions.
                </p>
              </div>

              <select
                style={styles.roleSelect}
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value as Role);
                  setAuthorizationMessage("");
                }}
              >
                {Object.keys(rolePermissions).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.rbacInfo}>
              <span>Authenticated Role</span>
              <strong>{selectedRole}</strong>
            </div>

            <div className="grid-2" style={styles.actionGrid}>
              {(
                [
                  ["users.view", "View Users", "See user records"],
                  ["users.create", "Create User", "Add a new user"],
                  ["users.edit", "Edit User", "Update user details"],
                  ["users.delete", "Delete User", "Remove a user"],
                  ["roles.manage", "Manage Roles", "Create or update roles"],
                  ["permissions.assign", "Assign Permissions", "Change access"],
                  [
                    "departments.view",
                    "View Departments",
                    "See department data",
                  ],
                  [
                    "departments.manage",
                    "Manage Departments",
                    "Update structure",
                  ],
                ] as [Permission, string, string][]
              ).map(([permission, title, description]) => {
                const allowed = hasPermission(permission);
                return (
                  <div key={permission} style={styles.actionCard}>
                    <div>
                      <h3 style={styles.actionTitle}>{title}</h3>
                      <p style={styles.actionDescription}>{description}</p>
                      <code style={styles.code}>{permission}</code>
                    </div>
                    <button
                      disabled={!allowed}
                      style={
                        allowed ? styles.actionAllowed : styles.actionDisabled
                      }
                      onClick={() => simulateAuthorization(permission)}
                    >
                      {allowed ? "Allowed Action" : "Disabled"}
                    </button>
                  </div>
                );
              })}
            </div>

            {authorizationMessage && (
              <div
                style={{
                  ...styles.authorizationBox,
                  borderColor: authorizationMessage.startsWith("200")
                    ? C.border
                    : "#fca5a5",
                  backgroundColor: authorizationMessage.startsWith("200")
                    ? C.softer
                    : "#fef2f2",
                  color: authorizationMessage.startsWith("200")
                    ? C.primaryDark
                    : "#991b1b",
                }}
              >
                {authorizationMessage}
              </div>
            )}
          </div>
        )}

        {activeTab === "Authorization Errors" && (
          <div className="grid-2" style={styles.errorLayout}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Authorization Errors</h2>
              <p style={styles.cardDescription}>
                Handle 401 and 403 responses clearly and safely.
              </p>

              <div style={styles.errorCard}>
                <div style={styles.errorCode}>401</div>
                <div>
                  <h3 style={styles.errorTitle}>Unauthorized</h3>
                  <p style={styles.errorText}>
                    The user is not authenticated. Redirect the user to the
                    login screen.
                  </p>
                  <button
                    style={styles.primaryButton}
                    onClick={() =>
                      setAuthorizationMessage(
                        "401 Unauthorized — Please log in to continue with valid token credentials.",
                      )
                    }
                  >
                    Simulate 401
                  </button>
                </div>
              </div>

              <div style={styles.errorCard}>
                <div
                  style={{
                    ...styles.errorCode,
                    backgroundColor: "#fff7ed",
                    color: "#c2410c",
                  }}
                >
                  403
                </div>
                <div>
                  <h3 style={styles.errorTitle}>Forbidden</h3>
                  <p style={styles.errorText}>
                    The user is authenticated but does not have permission for
                    this scoped action.
                  </p>
                  <button
                    style={styles.warningButton}
                    onClick={() =>
                      setAuthorizationMessage(
                        "403 Forbidden — You do not have sufficient privileges or department clearance.",
                      )
                    }
                  >
                    Simulate 403
                  </button>
                </div>
              </div>

              {authorizationMessage && (
                <div style={styles.errorMessage}>{authorizationMessage}</div>
              )}
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Authorization UX</h2>
              <p style={styles.cardDescription}>
                Recommended frontend behavior.
              </p>

              {[
                [
                  "1",
                  "401 Response",
                  "Send the user to the login page securely.",
                ],
                [
                  "2",
                  "403 Response",
                  "Show clear permission or department mismatch warnings.",
                ],
                [
                  "3",
                  "Hide Restricted Actions",
                  "Do not expose controls or routes the user cannot perform.",
                ],
              ].map(([n, t, d]) => (
                <div key={n} style={styles.uxItem}>
                  <span style={styles.uxNumber}>{n}</span>
                  <div>
                    <strong>{t}</strong>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {showUserModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {editingUser ? "Edit User" : "Add User"}
                </h2>
                <p style={styles.modalSubtitle}>
                  {editingUser
                    ? "Update the selected user's information."
                    : "Create a new user account."}
                </p>
              </div>
              <button
                style={styles.closeButton}
                onClick={() => setShowUserModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveUser}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.formInput}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter full name"
                required
              />

              <label style={styles.label}>Email</label>
              <input
                style={styles.formInput}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email address"
                required
              />

              <label style={styles.label}>Department</label>
              <select
                style={styles.formInput}
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              >
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <label style={styles.label}>Role</label>
              <select
                style={styles.formInput}
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as Role })
                }
              >
                {Object.keys(rolePermissions).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Status</label>
              <select
                style={styles.formInput}
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryButton}>
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoleModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Create Role</h2>
                <p style={styles.modalSubtitle}>Add a new system role.</p>
              </div>
              <button
                style={styles.closeButton}
                onClick={() => setShowRoleModal(false)}
              >
                ×
              </button>
            </div>

            <label style={styles.label}>Role Name</label>
            <input
              style={styles.formInput}
              value={roleForm.name}
              onChange={(e) =>
                setRoleForm({ ...roleForm, name: e.target.value })
              }
              placeholder="Example: Supervisor"
            />

            <label style={styles.label}>Description</label>
            <textarea
              style={{
                ...styles.formInput,
                minHeight: "90px",
                resize: "vertical",
              }}
              value={roleForm.description}
              onChange={(e) =>
                setRoleForm({ ...roleForm, description: e.target.value })
              }
              placeholder="Describe this role's scope..."
            />

            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowRoleModal(false)}
              >
                Cancel
              </button>
              <button
                style={styles.primaryButton}
                onClick={() => {
                  if (roleForm.name.trim()) {
                    rolePermissions[roleForm.name as Role] = [
                      "users.view",
                      "departments.view",
                    ];
                    setShowRoleModal(false);
                    setRoleForm({ name: "", description: "" });
                  }
                }}
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Helper state setter for dummy re-render on permissions update
function setRolePermissionsState(_val: any) {}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>
      <div>
        <p style={styles.statTitle}>{title}</p>
        <h2 style={styles.statValue}>{value}</h2>
      </div>
    </div>
  );
}

const flexCenter: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const navBase: React.CSSProperties = {
  width: "100%",
  border: "none",
  padding: "12px 14px",
  borderRadius: "9px",
  display: "flex",
  alignItems: "center",
  gap: "11px",
  fontSize: "13px",
  cursor: "pointer",
  textAlign: "left",
  marginBottom: "4px",
};
const toggleBase: React.CSSProperties = {
  minWidth: "92px",
  borderRadius: "20px",
  padding: "6px 9px",
  fontSize: "10px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  cursor: "pointer",
};
const dot: React.CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
};
const actionBtn: React.CSSProperties = {
  border: "none",
  padding: "8px 10px",
  borderRadius: "6px",
  fontSize: "10px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};
const cardBase: React.CSSProperties = {
  backgroundColor: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: "12px",
  boxSizing: "border-box",
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: C.bg,
    color: C.text,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  sidebar: {
    width: "250px",
    minHeight: "100vh",
    backgroundColor: C.white,
    borderRight: `1px solid ${C.border}`,
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 10px 28px",
    borderBottom: `1px solid ${C.border}`,
    marginBottom: "24px",
  },
  brandIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    backgroundColor: C.soft,
    fontSize: "20px",
    flexShrink: 0,
    ...flexCenter,
  },
  brandTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: C.primaryDark,
    lineHeight: 1.2,
  },
  brandSub: { fontSize: "11px", color: C.muted, marginTop: "3px" },
  navLabel: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: C.faint,
    margin: "0 12px 10px",
  },
  nav: { ...navBase, background: "transparent", color: C.muted },
  navActive: {
    ...navBase,
    backgroundColor: C.soft,
    color: C.primaryDark,
    fontWeight: "700",
  },
  sidebarBottom: { marginTop: "auto" },
  demoBox: {
    backgroundColor: C.softer,
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontSize: "12px",
    color: C.primaryDark,
  },
  demoTitle: {
    color: C.muted,
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  rolePill: {
    width: "fit-content",
    backgroundColor: C.primary,
    color: C.white,
    padding: "3px 8px",
    borderRadius: "20px",
    fontSize: "10px",
    marginTop: "4px",
  },
  content: {
    flex: 1,
    padding: "32px",
    overflowX: "hidden",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "26px",
  },
  heading: { margin: 0, fontSize: "28px", fontWeight: "800", color: C.text },
  subtitle: { margin: "7px 0 0", color: C.muted, fontSize: "13px" },
  primaryButton: {
    border: "none",
    backgroundColor: C.primary,
    color: C.white,
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  warningButton: {
    border: "none",
    backgroundColor: "#f97316",
    color: C.white,
    padding: "9px 14px",
    borderRadius: "7px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  statCard: {
    ...cardBase,
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },
  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: C.soft,
    color: C.primaryDark,
    fontSize: "18px",
    ...flexCenter,
  },
  statTitle: { margin: 0, fontSize: "11px", color: C.muted },
  statValue: { margin: "3px 0 0", fontSize: "24px", color: C.text },
  card: { ...cardBase, padding: "22px", marginBottom: "20px" },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  cardTitle: { margin: 0, fontSize: "18px", fontWeight: "800", color: C.text },
  cardDescription: { margin: "5px 0 0", color: C.muted, fontSize: "12px" },
  search: {
    width: "220px",
    padding: "9px 12px",
    border: `1px solid ${C.border}`,
    borderRadius: "7px",
    outline: "none",
    fontSize: "12px",
    boxSizing: "border-box",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    WebkitOverflowScrolling: "touch",
  },
  table: { width: "100%", minWidth: "700px", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: C.softer,
    borderBottom: `1px solid ${C.border}`,
    color: C.muted,
    fontSize: "11px",
    fontWeight: "700",
  },
  td: {
    padding: "14px 12px",
    borderBottom: `1px solid ${C.line}`,
    fontSize: "12px",
    color: "#334155",
  },
  userCell: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: C.soft,
    color: C.primaryDark,
    fontWeight: "800",
    fontSize: "12px",
    flexShrink: 0,
    ...flexCenter,
  },
  userName: { fontSize: "12px", color: C.text },
  email: { color: C.faint, fontSize: "10px", marginTop: "2px" },
  roleBadge: {
    backgroundColor: C.soft,
    color: C.primaryDark,
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },
  activeBadge: { color: "#0284c7", fontWeight: "700", fontSize: "11px" },
  inactiveBadge: { color: "#dc2626", fontWeight: "700", fontSize: "11px" },
  actions: { display: "flex", gap: "7px" },
  smallButton: {
    border: `1px solid ${C.border}`,
    backgroundColor: C.softer,
    color: C.primaryDark,
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },
  deleteButton: {
    border: "1px solid #fecaca",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  roleCard: {
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    backgroundColor: C.white,
  },
  roleIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    backgroundColor: C.softer,
    fontSize: "20px",
    marginBottom: "12px",
    ...flexCenter,
  },
  roleName: { margin: 0, color: C.text, fontSize: "16px" },
  roleDescription: {
    color: C.muted,
    fontSize: "12px",
    lineHeight: 1.6,
    minHeight: "38px",
  },
  permissionCount: {
    color: C.primaryDark,
    fontSize: "11px",
    fontWeight: "700",
  },
  roleSelect: {
    border: `1px solid ${C.border}`,
    backgroundColor: C.white,
    borderRadius: "7px",
    padding: "9px 12px",
    fontSize: "12px",
    color: "#334155",
  },
  permissionPanel: {
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    overflow: "hidden",
  },
  selectedRoleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    backgroundColor: C.softer,
    borderBottom: `1px solid ${C.border}`,
  },
  miniLabel: {
    color: C.faint,
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.7px",
  },
  selectedRole: { margin: "4px 0 0", fontSize: "20px", color: C.text },
  permissionTotal: {
    color: C.primaryDark,
    backgroundColor: C.soft,
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },
  permissionGroup: { padding: "18px", borderBottom: `1px solid ${C.line}` },
  groupTitle: { margin: "0 0 10px", fontSize: "12px", color: "#475569" },
  permissionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "12px 0",
    borderTop: `1px solid ${C.softer}`,
  },
  permissionName: { color: "#334155", fontSize: "12px" },
  permissionCode: { color: C.faint, fontSize: "10px", marginTop: "3px" },
  toggleOn: {
    ...toggleBase,
    border: `1px solid ${C.border}`,
    backgroundColor: C.softer,
    color: C.primaryDark,
  },
  toggleOff: {
    ...toggleBase,
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    color: C.muted,
  },
  toggleCircleOn: { ...dot, backgroundColor: C.primary },
  toggleCircleOff: { ...dot, backgroundColor: C.faint },
  rbacInfo: {
    backgroundColor: C.softer,
    border: `1px solid ${C.border}`,
    borderRadius: "8px",
    padding: "12px 15px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: C.primaryDark,
    marginBottom: "16px",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  actionCard: {
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },
  actionTitle: { margin: 0, fontSize: "13px", color: C.text },
  actionDescription: { margin: "4px 0 6px", fontSize: "10px", color: C.muted },
  code: {
    fontSize: "9px",
    backgroundColor: C.soft,
    padding: "3px 6px",
    borderRadius: "4px",
    color: C.primaryDark,
  },
  actionAllowed: {
    ...actionBtn,
    backgroundColor: C.primary,
    color: C.white,
    cursor: "pointer",
  },
  actionDisabled: {
    ...actionBtn,
    backgroundColor: "#e2e8f0",
    color: C.faint,
    cursor: "not-allowed",
  },
  authorizationBox: {
    border: "1px solid",
    borderRadius: "8px",
    padding: "12px",
    marginTop: "16px",
    fontSize: "12px",
    fontWeight: "600",
  },
  errorLayout: {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
    gap: "20px",
  },
  errorCard: {
    display: "flex",
    gap: "15px",
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    padding: "16px",
    marginTop: "15px",
  },
  errorCode: {
    width: "54px",
    height: "54px",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    fontWeight: "900",
    fontSize: "15px",
    flexShrink: 0,
    ...flexCenter,
  },
  errorTitle: { margin: "0 0 4px", fontSize: "14px", color: C.text },
  errorText: {
    margin: "0 0 12px",
    color: C.muted,
    fontSize: "11px",
    lineHeight: 1.5,
  },
  errorMessage: {
    marginTop: "15px",
    backgroundColor: C.softer,
    border: `1px solid ${C.border}`,
    color: C.primaryDark,
    borderRadius: "8px",
    padding: "12px",
    fontSize: "11px",
    fontWeight: "600",
  },
  uxItem: {
    display: "flex",
    gap: "12px",
    padding: "14px 0",
    borderBottom: `1px solid ${C.line}`,
  },
  uxNumber: {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    backgroundColor: C.soft,
    color: C.primaryDark,
    fontSize: "11px",
    fontWeight: "800",
    flexShrink: 0,
    ...flexCenter,
  },
  dashGrid: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px" },
  deptRow: { marginBottom: "16px" },
  deptTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginBottom: "6px",
    color: C.text,
  },
  deptMeta: { color: C.muted, fontSize: "11px" },
  barTrack: {
    height: "8px",
    borderRadius: "20px",
    backgroundColor: C.soft,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: "20px", backgroundColor: C.primary },
  overviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "18px",
  },
  overviewCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    padding: "12px 14px",
    backgroundColor: C.softer,
  },
  recentRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: `1px solid ${C.line}`,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(12, 74, 110, 0.35)",
    zIndex: 1000,
    padding: "20px",
    boxSizing: "border-box",
    ...flexCenter,
  },
  modal: {
    width: "100%",
    maxWidth: "460px",
    backgroundColor: C.white,
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(3,105,161,0.2)",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  modalTitle: { margin: 0, fontSize: "20px", color: C.text },
  modalSubtitle: { margin: "5px 0 0", color: C.muted, fontSize: "11px" },
  closeButton: {
    border: "none",
    background: "transparent",
    color: C.muted,
    fontSize: "24px",
    cursor: "pointer",
  },
  label: {
    display: "block",
    margin: "12px 0 6px",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
  },
  formInput: {
    width: "100%",
    border: `1px solid ${C.border}`,
    borderRadius: "7px",
    padding: "10px 11px",
    fontSize: "12px",
    color: C.text,
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: C.white,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "20px",
  },
  cancelButton: {
    border: `1px solid ${C.border}`,
    backgroundColor: C.white,
    color: "#475569",
    padding: "9px 14px",
    borderRadius: "7px",
    fontSize: "12px",
    cursor: "pointer",
  },
};
