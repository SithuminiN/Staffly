export interface NavItem {
  name: string;
  href: string;
  permission?: string;
  icon?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
  },
  {
    name: "Users",
    href: "/users",
    permission: "users.view",
  },
  {
    name: "Roles",
    href: "/roles",
    permission: "roles.manage",
  },
  {
    name: "Permissions",
    href: "/permissions",
    permission: "permissions.view",
  },
];

export function getFilteredNavigation(userPermissions: string[]): NavItem[] {
  if (userPermissions.includes("super-admin")) {
    return NAVIGATION_ITEMS;
  }

  return NAVIGATION_ITEMS.filter((item) => {
    if (!item.permission) return true;
    return userPermissions.includes(item.permission);
  });
}
