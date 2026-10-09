"use client";
import { Modal, Badge, Button } from "@/components/common/ui";
import { Employee } from "@/types/employee";

export default function EmployeeDetailsModal({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
}) {
  const rows: [string, React.ReactNode][] = [
    ["Name", employee.name],
    ["Email", employee.email],
    ["Department", employee.department],
    ["Role", <Badge key="r">{employee.role}</Badge>],
    ["Status", <Badge key="s" tone={employee.status === "Active" ? "green" : "gray"}>{employee.status}</Badge>],
  ];
  return (
    <Modal title="Employee Details" onClose={onClose}>
      {rows.map(([label, value]) => (
        <div
          key={label}
          style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e0f2fe", fontSize: 13 }}
        >
          <span style={{ color: "#64748b" }}>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}