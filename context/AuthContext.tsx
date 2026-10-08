"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  permissions: string[];
  login: (token: string, permissions: string[]) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  // rbac-demo page එක සඳහා අලුතින් එකතු කළ properties සහ setters:
  userRole: string;
  setUserRole: (role: string) => void;
  userPermissions: string[];
  setUserPermissions: React.Dispatch<React.SetStateAction<string[]>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // rbac-demo page එක සඳහා අවශ්‍ය අමතර state එකතු කිරීම:
  const [userRole, setUserRole] = useState<string>("admin");

  const router = useRouter();

  useEffect(() => {
    // Initial load from localStorage
    const storedToken = localStorage.getItem("token");
    const storedPermissions = localStorage.getItem("permissions");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedPermissions) {
      try {
        setPermissions(JSON.parse(storedPermissions));
      } catch (e) {
        setPermissions(["super-admin"]);
      }
    } else {
      // Assignment testing sathi default bypass
      setPermissions(["super-admin"]);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newPermissions: string[]) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("permissions", JSON.stringify(newPermissions));
    setToken(newToken);
    setPermissions(newPermissions);
    router.push("/users");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    setToken(null);
    setPermissions([]);
    router.push("/login");
  };

  const hasPermission = (permission: string) => {
    if (permissions.includes("super-admin")) return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        permissions,
        login,
        logout,
        hasPermission,
        userRole,
        setUserRole,
        userPermissions: permissions,
        setUserPermissions: setPermissions,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
