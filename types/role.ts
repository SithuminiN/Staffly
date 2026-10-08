export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[]; // Permission names or IDs
}
