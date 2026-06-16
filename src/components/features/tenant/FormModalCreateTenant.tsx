import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Tenant } from "@/types/tenant.type";

interface FormModalCreateTenantProps {
  open: boolean;
  onClose: () => void;
  editData?: Tenant | null;
  onSave?: (data: {
    code: string;
    name: string;
    owner_name: string;
    phone: string;
    address: string;
    is_active: boolean;
  }) => void;
}

export default function FormModalCreateTenant({
  open,
  onClose,
  editData,
  onSave,
}: FormModalCreateTenantProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (open) {
      if (editData) {
        setCode(editData.code);
        setName(editData.name);
        setOwnerName(editData.owner_name);
        setPhone(editData.phone);
        setAddress(editData.address);
        setIsActive(editData.is_active);
      } else {
        setCode("");
        setName("");
        setOwnerName("");
        setPhone("");
        setAddress("");
        setIsActive(true);
      }
    }
  }, [open, editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length < 3) {
      toast.error("Kode outlet minimal 3 karakter");
      return;
    }
    if (!name.trim()) {
      toast.error("Nama outlet wajib diisi");
      return;
    }
    if (!ownerName.trim()) {
      toast.error("Nama pemilik wajib diisi");
      return;
    }

    if (onSave) {
      onSave({
        code,
        name,
        owner_name: ownerName,
        phone,
        address,
        is_active: isActive,
      });
    } else {
      if (editData) {
        toast.success(`Outlet "${name}" berhasil diperbarui! (Mock)`);
      } else {
        toast.success(`Outlet "${name}" berhasil didaftarkan! (Mock)`);
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Outlet" : "Tambah Outlet Baru"}</DialogTitle>
          <DialogDescription>
            {editData
              ? "Perbarui profil dan status outlet terdaftar."
              : "Daftarkan cabang outlet atau dapur produksi baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Code */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Kode Outlet (Kode Tenant)
            </label>
            <Input
              placeholder="Contoh: TEN-SUD"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono"
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Nama Outlet
            </label>
            <Input
              placeholder="Contoh: SOOM Cafe - Sudirman"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Owner */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Nama Pemilik (Owner)
            </label>
            <Input
              placeholder="Contoh: Rizky Irvandi"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              No. Telepon / WhatsApp
            </label>
            <Input
              placeholder="Contoh: 0812-3456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Alamat Lengkap
            </label>
            <Input
              placeholder="Contoh: Jl. Sudirman No. 102, Jakarta Pusat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fandm-text)]">
              Status Operasional
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
                {isActive ? "Buka (Aktif)" : "Tutup Sementara"}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editData ? "Simpan Perubahan" : "Daftarkan Outlet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
