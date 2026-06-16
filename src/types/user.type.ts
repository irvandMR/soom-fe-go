export interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "owner" | "karyawan";
  is_active: boolean;
  tenantId?: string;
}

