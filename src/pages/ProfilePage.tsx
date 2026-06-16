import { useAuthStore } from "@/store/useAuthStore";
import { useActiveTenantStore, TENANT_OPTIONS } from "@/store/useActiveTenantStore";
import PageHeader from "@/components/widget/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Store, Calendar, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProfilePageProps {
  defaultTab?: "profile" | "password";
}

export default function ProfilePage({ defaultTab = "profile" }: ProfilePageProps) {
  const { user } = useAuthStore();
  const { activeTenantId } = useActiveTenantStore();
  const activeTenant = TENANT_OPTIONS.find(t => t.id === activeTenantId) || TENANT_OPTIONS[0];

  // Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "password">(defaultTab);

  // Sync tab if prop changes (e.g. user navigates from menu)
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Profile Form States
  const [username, setUsername] = useState(user?.username || "Admin");
  const [email, setEmail] = useState(user?.email || "admin@soom.com");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toast.success("Profil berhasil diperbarui! (Mock)");
    }, 800);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password baru minimal harus terdiri dari 6 karakter!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok!");
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      toast.success("Password berhasil diperbarui! (Mock)");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const initials = username
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "A";

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <PageHeader
        title="Pengaturan Akun"
        subtitle="Kelola profil Anda, hak akses tenant, dan atur keamanan sandi"
      />

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Side Navigation Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-3">
          <Card className="p-4 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs flex flex-row md:flex-col gap-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex-1 md:flex-initial flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left",
                activeTab === "profile"
                  ? "bg-indigo-50 text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <User size={15} />
              <span>Profil Saya</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={cn(
                "flex-1 md:flex-initial flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left",
                activeTab === "password"
                  ? "bg-indigo-50 text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Lock size={15} />
              <span>Ganti Password</span>
            </button>
          </Card>

          {/* Quick Info under tabs (Desktop only) */}
          <Card className="hidden md:flex p-5 flex-col items-center text-center border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[var(--fandm-primary)] flex items-center justify-center text-white text-xl font-bold">
              {initials}
            </div>
            <h4 className="text-sm font-black text-slate-800 mt-3 truncate w-full">{username}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{user?.role ?? "Admin"}</p>
            <div className="w-full border-t border-slate-100 my-4" />
            <div className="w-full flex items-center justify-between text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Cabang</span>
              <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate">{activeTenant.name}</span>
            </div>
          </Card>
        </div>

        {/* Right Side Tab Content */}
        <div className="flex-1">
          {activeTab === "profile" ? (
            <Card className="p-6 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5 pb-2 border-b border-slate-50">
                Detail Profil
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form onSubmit={handleSaveProfile} className="lg:col-span-2 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 opacity-60">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ID Pengguna</label>
                    <input
                      type="text"
                      value={user?.id || "MOCK-ID-123456"}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 cursor-not-allowed text-slate-500 font-mono"
                    />
                  </div>

                  <div className="mt-2 flex justify-end">
                    <Button type="submit" disabled={isSavingProfile}>
                      {isSavingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                  </div>
                </form>

                {/* Right side credentials display */}
                <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 flex flex-col gap-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Akses Tenant Aktif</span>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <Shield size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Peran Global</p>
                      <p className="text-xs font-bold text-slate-700 capitalize">{user?.role ?? "Admin"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <Store size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tenant Cabang</p>
                      <p className="text-xs font-bold text-slate-700">{activeTenant.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Status Dapur</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CheckCircle size={11} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-700">Aktif & Terisolasi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-[var(--fandm-border)] bg-white rounded-2xl shadow-xs">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5 pb-2 border-b border-slate-50">
                Ubah Kata Sandi
              </h3>

              <form onSubmit={handleSavePassword} className="flex flex-col gap-4 max-w-xl">
                {/* Current Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password Sekarang</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password Baru</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex justify-end">
                  <Button type="submit" disabled={isSavingPassword}>
                    {isSavingPassword ? "Memproses..." : "Perbarui Password"}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
