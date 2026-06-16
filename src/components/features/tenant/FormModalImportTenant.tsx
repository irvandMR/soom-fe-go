import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { parseCSV } from "@/utils/csvParser";
import { toast } from "sonner";
import {
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { Tenant } from "@/types/tenant.type";
import type { User } from "@/types/user.type";

interface FormModalImportTenantProps {
  open: boolean;
  onClose: () => void;
  onImport: (newTenants: Tenant[]) => void;
}

interface ParsedRow {
  tempId: string;
  namaTenant: string;
  kodeTenant: string;
  alamatTenant: string;
  noTelpTenant: string;
  namaOwner: string;
  emailOwner: string;
  status: "valid" | "error";
  errors: string[];
}

export default function FormModalImportTenant({
  open,
  onClose,
  onImport,
}: FormModalImportTenantProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setParsedRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const csvHeaders = "nama_tenant,kode_tenant,alamat_tenant,no_telp_tenant,nama_owner,email_owner\n";
    const csvSample = "SOOM Dago,TEN-DAG,Jl. Ir. H. Juanda No. 85 Bandung,082198765432,Budi Santoso,budi.owner@soom.com\n";
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvHeaders + csvSample);
    
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "template_registrasi_tenant.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Template CSV berhasil diunduh");
  };

  const processFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Format file tidak didukung. Harap unggah file CSV (.csv)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        toast.error("File CSV kosong atau tidak terbaca");
        return;
      }

      try {
        const rawLines = parseCSV(text);
        if (rawLines.length <= 1) {
          toast.error("Tidak ada baris data terdeteksi (hanya header atau kosong)");
          return;
        }

        // Header mapping check
        const headers = rawLines[0].map(h => h.toLowerCase());
        const expectedHeaders = ["nama_tenant", "kode_tenant", "alamat_tenant", "no_telp_tenant", "nama_owner", "email_owner"];
        
        // Basic header verification
        const hasRequiredHeaders = expectedHeaders.every(h => headers.includes(h));
        if (!hasRequiredHeaders) {
          toast.error("Format header CSV tidak sesuai template. Pastikan header sesuai.");
          return;
        }

        // Map column indices
        const idxNamaTenant = headers.indexOf("nama_tenant");
        const idxKodeTenant = headers.indexOf("kode_tenant");
        const idxAlamatTenant = headers.indexOf("alamat_tenant");
        const idxNoTelpTenant = headers.indexOf("no_telp_tenant");
        const idxNamaOwner = headers.indexOf("nama_owner");
        const idxEmailOwner = headers.indexOf("email_owner");

        const dataRows = rawLines.slice(1);
        const mappedRows: ParsedRow[] = dataRows.map((row, index) => {
          const namaTenant = row[idxNamaTenant] || "";
          const kodeTenant = row[idxKodeTenant] || "";
          const alamatTenant = row[idxAlamatTenant] || "";
          const noTelpTenant = row[idxNoTelpTenant] || "";
          const namaOwner = row[idxNamaOwner] || "";
          const emailOwner = row[idxEmailOwner] || "";

          const errors: string[] = [];

          // Validate
          if (!namaTenant.trim()) {
            errors.push("Nama outlet wajib diisi");
          } else if (namaTenant.length < 3) {
            errors.push("Nama outlet minimal 3 karakter");
          }

          if (!kodeTenant.trim()) {
            errors.push("Kode outlet wajib diisi");
          } else if (!/^[a-zA-Z0-9-]{3,15}$/.test(kodeTenant)) {
            errors.push("Kode outlet harus 3-15 karakter alfanumerik / tanda hubung (-)");
          }

          if (!namaOwner.trim()) {
            errors.push("Nama pemilik (owner) wajib diisi");
          }

          if (!emailOwner.trim()) {
            errors.push("Email owner wajib diisi");
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOwner)) {
            errors.push("Format email owner tidak valid");
          }

          return {
            tempId: `${Date.now()}-${index}`,
            namaTenant,
            kodeTenant,
            alamatTenant,
            noTelpTenant,
            namaOwner,
            emailOwner,
            status: errors.length > 0 ? "error" : "valid",
            errors,
          };
        });

        setParsedRows(mappedRows);
        toast.success(`Berhasil memuat ${mappedRows.length} baris data`);
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengurai file CSV");
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDeleteRow = (tempId: string) => {
    setParsedRows(prev => prev.filter(r => r.tempId !== tempId));
  };

  const handleImport = () => {
    const validRows = parsedRows.filter(r => r.status === "valid");
    if (validRows.length === 0) {
      toast.error("Tidak ada baris data valid yang bisa diimpor");
      return;
    }

    // Generate new Tenants
    const newTenants: Tenant[] = validRows.map(row => ({
      id: `ten-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: row.namaTenant,
      code: row.kodeTenant.toUpperCase(),
      address: row.alamatTenant || "-",
      owner_name: row.namaOwner,
      phone: row.noTelpTenant || "-",
      is_active: true,
      created_at: new Date().toISOString()
    }));

    // Generate corresponding Users (owners)
    const newUsers: User[] = validRows.map((row, idx) => ({
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: row.namaOwner,
      email: row.emailOwner,
      role: "owner" as const,
      is_active: true,
      tenantId: newTenants[idx].id
    }));

    // Save Users to localStorage (syncing with UserManagementPage)
    try {
      const existingUsersStr = localStorage.getItem("soom-users");
      const existingUsers: User[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      localStorage.setItem("soom-users", JSON.stringify([...newUsers, ...existingUsers]));
    } catch (err) {
      console.error("Gagal menyinkronkan user owner baru ke localStorage:", err);
    }

    // Callback to save Tenants
    onImport(newTenants);
    toast.success(`Berhasil mengimpor ${newTenants.length} outlet beserta owner-nya!`);
    onClose();
    handleReset();
  };

  const totalValid = parsedRows.filter(r => r.status === "valid").length;
  const totalError = parsedRows.filter(r => r.status === "error").length;

  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (!o) {
        onClose();
        handleReset();
      }
    }}>
      <DialogContent className="max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="text-indigo-600" size={20} />
            <span>Import Registrasi Tenant Baru</span>
          </DialogTitle>
          <DialogDescription>
            Unduh template CSV, isi data outlet beserta akun owner-nya, lalu unggah kembali untuk pendaftaran massal.
          </DialogDescription>
        </DialogHeader>

        {parsedRows.length === 0 ? (
          <div className="flex flex-col gap-4 py-4 flex-1 overflow-y-auto">
            {/* Step 1: Download Template */}
            <div className="border rounded-xl p-4 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">1. Unduh Template Acuan</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gunakan template CSV dengan kolom yang sesuai untuk menghindari kegagalan pendaftaran.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 shrink-0"
                onClick={downloadTemplate}
              >
                <Download size={14} />
                <span>Unduh CSV</span>
              </Button>
            </div>

            {/* Step 2: Drag and Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                isDragActive
                  ? "border-indigo-600 bg-indigo-50/50"
                  : "border-slate-300 hover:border-indigo-400 bg-white"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileSelect}
              />
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-3 transition-transform hover:scale-115">
                <Upload size={32} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Seret & letakkan file CSV Anda di sini, atau{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:underline font-bold"
                  onClick={() => fileInputRef.current?.click()}
                >
                  pilih file dari komputer
                </button>
              </p>
              <p className="text-xs text-slate-400 mt-1.5">
                Format yang didukung: .csv (Maks. 5MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-3 flex-1 overflow-hidden">
            {/* Summary Banner */}
            <div className="flex items-center justify-between border px-4 py-3 rounded-lg bg-slate-50 shrink-0">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                <span>Total: {parsedRows.length} baris</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={13} /> {totalValid} Valid
                </span>
                {totalError > 0 && (
                  <span className="flex items-center gap-1 text-rose-600">
                    <AlertTriangle size={13} /> {totalError} Error
                  </span>
                )}
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="h-7 text-xs"
                onClick={handleReset}
              >
                Ulangi Upload
              </Button>
            </div>

            {/* Warning if there are errors */}
            {totalError > 0 && (
              <div className="border border-amber-200 bg-amber-50 p-2.5 rounded-lg text-xs text-amber-800 flex items-start gap-2 shrink-0">
                <AlertCircle className="shrink-0 text-amber-600" size={14} />
                <span>
                  Terdapat baris data yang bermasalah. Hanya baris berstatus **Valid** yang akan diimpor ke sistem. Anda dapat menghapus baris bermasalah secara manual atau memperbaikinya di file CSV asli dan mengunggah kembali.
                </span>
              </div>
            )}

            {/* Table Preview */}
            <div className="border rounded-lg overflow-y-auto flex-1 max-h-[350px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 sticky top-0 font-semibold text-slate-600 border-b">
                  <tr>
                    <th className="p-2.5 w-12 text-center">No</th>
                    <th className="p-2.5">Outlet</th>
                    <th className="p-2.5">Owner</th>
                    <th className="p-2.5">Alamat / Telp</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 w-12 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {parsedRows.map((row, idx) => (
                    <tr
                      key={row.tempId}
                      className={row.status === "error" ? "bg-rose-50/40" : "hover:bg-slate-50/80"}
                    >
                      <td className="p-2.5 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{row.namaTenant}</div>
                        <div className="text-[10px] text-indigo-600 font-mono mt-0.5">{row.kodeTenant}</div>
                      </td>
                      <td className="p-2.5">
                        <div className="font-semibold">{row.namaOwner}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.emailOwner}</div>
                      </td>
                      <td className="p-2.5">
                        <div className="truncate max-w-[150px]" title={row.alamatTenant}>
                          {row.alamatTenant || "-"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {row.noTelpTenant || "-"}
                        </div>
                      </td>
                      <td className="p-2.5">
                        {row.status === "valid" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                            <CheckCircle2 size={10} /> Valid
                          </span>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex w-fit items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                              <AlertTriangle size={10} /> Format Salah
                            </span>
                            <span className="text-[9px] text-rose-500 font-medium leading-tight mt-0.5 block max-w-[180px]">
                              {row.errors.join(", ")}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                          onClick={() => handleDeleteRow(row.tempId)}
                          title="Hapus baris ini"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <DialogFooter className="pt-2 border-t shrink-0">
          <Button variant="outline" onClick={() => {
            onClose();
            handleReset();
          }}>
            Batal
          </Button>
          {parsedRows.length > 0 && (
            <Button
              onClick={handleImport}
              disabled={totalValid === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Impor {totalValid} Data Valid
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
