"use client";
import React, { useState } from "react";
import { Modal, Button, inputStyle, labelStyle } from "@/components/common/ui";
import { FormErrorBanner, FieldErrorMessage } from "@/components/common/FormError";
import { ApiRequestError, FieldError, getErrorMessage } from "@/lib/apiClient";
import { createEmployee, updateEmployee } from "@/lib/employeeService";
import { DEPARTMENTS } from "@/lib/constants";
import { Employee, EmployeePayload, EmployeeStatus } from "@/types/employee";

interface Props {
  employee: Employee | null; // null = create mode
  onClose: () => void;
  onSaved: () => void;
}

export default function EmployeeFormModal({ employee, onClose, onSaved }: Props) {
  const [form, setForm] = useState<EmployeePayload>({
    name: employee?.name ?? "",
    email: employee?.email ?? "",
    department: employee?.department ?? DEPARTMENTS[0],
    role: employee?.role ?? "",
    status: employee?.status ?? "Active",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const errorFor = (field: string) =>
    fieldErrors.find((e) => e.field === field)?.message;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setFieldErrors([]);
    try {
      if (employee) await updateEmployee(employee.id, form);
      else await createEmployee(form);
      onSaved();
    } catch (err) {
      setMessage(getErrorMessage(err));
      if (err instanceof ApiRequestError) setFieldErrors(err.errors);
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof EmployeePayload, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal
      title={employee ? "Edit Employee" : "Add Employee"}
      subtitle={employee ? "Update employee information." : "Create a new employee."}
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <FormErrorBanner message={message} />

        <label style={labelStyle}>Full Name</label>
        <input style={inputStyle} value={form.name} required onChange={(e) => set("name", e.target.value)} />
        <FieldErrorMessage message={errorFor("name")} />

        <label style={labelStyle}>Email</label>
        <input style={inputStyle} type="email" value={form.email} required onChange={(e) => set("email", e.target.value)} />
        <FieldErrorMessage message={errorFor("email")} />

        <label style={labelStyle}>Department</label>
        <select style={inputStyle} value={form.department} onChange={(e) => set("department", e.target.value)}>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <FieldErrorMessage message={errorFor("department")} />

        <label style={labelStyle}>Role</label>
        <input style={inputStyle} value={form.role} required onChange={(e) => set("role", e.target.value)} />
        <FieldErrorMessage message={errorFor("role")} />

        <label style={labelStyle}>Status</label>
        <select style={inputStyle} value={form.status} onChange={(e) => set("status", e.target.value as EmployeeStatus)}>
          <option>Active</option>
          <option>On Leave</option>
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : employee ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}