"use client";

import React, { ReactNode } from "react";

// Light blue + white palette (same as the original prototype)
export const C = {
  primary: "#0ea5e9",
  primaryDark: "#0369a1",
  soft: "#e0f2fe",
  softer: "#f0f9ff",
  border: "#bae6fd",
  text: "#0c4a6e",
  muted: "#64748b",
  faint: "#94a3b8",
  white: "#ffffff",
  bg: "#f5fbff",
  danger: "#dc2626",
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid ${C.border}`,
  borderRadius: 7,
  padding: "10px 11px",
  fontSize: 13,
  color: C.text,
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: C.white,
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  margin: "12px 0 6px",
  color: "#475569",
  fontSize: 12,
  fontWeight: 700,
};

export const tableStyles: Record<string, React.CSSProperties> = {
  wrapper: { width: "100%", overflowX: "auto" },
  table: { width: "100%", minWidth: 680, borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: 12,
    backgroundColor: C.softer,
    borderBottom: `1px solid ${C.border}`,
    color: C.muted,
    fontSize: 12,
    fontWeight: 700,
  },
  td: {
    padding: "14px 12px",
    borderBottom: `1px solid ${C.soft}`,
    fontSize: 13,
    color: "#334155",
  },
};

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 22,
        marginBottom: 20,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div
      className="card-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
        marginBottom: 20,
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.text }}>
          {title}
        </h2>
        {description && (
          <p style={{ margin: "5px 0 0", color: C.muted, fontSize: 12 }}>
            {description}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

type Variant = "primary" | "secondary" | "danger" | "warning";

export function Button({
  variant = "primary",
  small,
  style,
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  small?: boolean;
}) {
  const variants: Record<Variant, React.CSSProperties> = {
    primary: { backgroundColor: C.primary, color: C.white },
    secondary: {
      backgroundColor: C.softer,
      color: C.primaryDark,
      borderColor: C.border,
    },
    danger: {
      backgroundColor: "#fef2f2",
      color: C.danger,
      borderColor: "#fecaca",
    },
    warning: { backgroundColor: "#f97316", color: C.white },
  };
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        border: "1px solid transparent",
        borderRadius: 8,
        fontWeight: 700,
        whiteSpace: "nowrap",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        padding: small ? "6px 10px" : "10px 16px",
        fontSize: small ? 11 : 13,
        ...variants[variant],
        ...style,
      }}
    />
  );
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "red" | "gray";
}) {
  const tones = {
    blue: { backgroundColor: C.soft, color: C.primaryDark },
    green: { backgroundColor: "#dcfce7", color: "#166534" },
    red: { backgroundColor: "#fee2e2", color: "#991b1b" },
    gray: { backgroundColor: "#f1f5f9", color: C.muted },
  };
  return (
    <span
      style={{
        ...tones[tone],
        padding: "4px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}) {
  const tones = {
    error: {
      backgroundColor: "#fef2f2",
      borderColor: "#fca5a5",
      color: "#991b1b",
    },
    success: {
      backgroundColor: "#f0fdf4",
      borderColor: "#86efac",
      color: "#166534",
    },
    info: {
      backgroundColor: C.softer,
      borderColor: C.border,
      color: C.primaryDark,
    },
  };
  return (
    <div
      role="alert"
      style={{
        ...tones[tone],
        border: "1px solid",
        borderRadius: 8,
        padding: 12,
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div
      style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 13 }}
    >
      {text}
    </div>
  );
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(12,74,110,0.35)",
        zIndex: 1000,
        padding: 20,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: C.white,
          borderRadius: 14,
          padding: 24,
          boxSizing: "border-box",
          boxShadow: "0 20px 50px rgba(3,105,161,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: C.text }}>{title}</h2>
            {subtitle && (
              <p style={{ margin: "5px 0 0", color: C.muted, fontSize: 12 }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: C.muted,
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
