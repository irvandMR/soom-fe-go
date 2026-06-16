import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useActiveTenantStore, TENANT_OPTIONS } from "@/store/useActiveTenantStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { User } from "@/types/user.type";

interface FormModalCreateUserProps {
  open: boolean;
  onClose: () => void;
  editData?: User | null;
  onSave?: (data: { name: string; email: string; role: User["role"]; is_active: boolean; tenantId: string }) => void;
}

export default function FormModalCreateUser({
  open,
  onClose,
  editData,
  onSave,
}: FormModalCreateUserProps) {
  const { user: currentUser } = useAuthStore();
  const { activeTenantId } = useActiveTenantStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("karyawan");
  const [isActive, setIsActive] = useState(true);
  const [tenantId, setTenantId] = useState("");

  const availableRoles = useMemo(() => {
    const baseList = [
      { value: "karyawan", label: "Karyawan / Staff" },
    ];
    if (currentUser?.role === "superadmin") {
      return [
        { value: "superadmin", label: "Super Admin (Sistem)" },
        { value: "owner", label: "Owner (Pemilik Usaha)" },
        ...baseList,
      ];
    }
    return baseList;
  }, [currentUser]);

  useEffect(() => {
    if (open) {
      if (editData) {
        setName(editData.name);
        setEmail(editData.email);
        setRole(editData.role);
        setIsActive(editData.is_active);
        setTenantId(editData.tenantId || activeTenantId);
      } else {
        setName("");
        setEmail("");
        setRole("karyawan");
        setIsActive(true);
        setTenantId(activeTenantId);
      }
    }
  }, [open, editData, activeTenantId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama pengguna wajib diisi");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Alamat email tidak valid");
      return;
    }

    if (onSave) {
      onSave({
        name,
        email,
        role: role as User["role"],
        is_active: isActive,
        tenantId: tenantId || activeTenantId,
      });
    } else {
      if (editData) {
        toast.success(`Pengguna "${name}" berhasil diperbarui! (Mock)`);
      } else {
        toast.success(`Pengguna "${name}" berhasil ditambahkan! (Mock)`);
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Pengguna" : "Tambah Pengguna"}</DialogTitle>
          <DialogDescription>
            {editData
              ? "Perbarui hak akses dan status pengguna."
              : "Undang pengguna baru untuk mengelola sistem pembukuan."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Nama Lengkap
            </label>
            <Input
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Email
            </label>
            <Input
              type="email"
              placeholder="Contoh: budi@soom.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Tenant Cabang (Super Admin Only) */}
          {currentUser?.role === "superadmin" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--fandm-text)]">
                Tenant Cabang
              </label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Tenant Cabang" />
                </SelectTrigger>
                <SelectContent>
                  {TENANT_OPTIONS.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Peran Pengguna (Role)
            </label>
            <Select value={role} onValueChange={(val: any) => setRole(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Status Akun
            </label>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full transition-colors",
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {isActive ? "Aktif (Bisa Login)" : "Non-aktif (Akses Dicabut)"}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editData ? "Simpan Perubahan" : "Tambah Pengguna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
