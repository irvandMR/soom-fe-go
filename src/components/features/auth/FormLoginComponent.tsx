import { useState } from "react";
import { useNavigate, Navigate, data } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KitchenWatermark } from "@/components/common/Decorations";
import BannerBackground from "@/components/common/BannerBackground";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/constant/routes";
import logo from "@/assets/image.png";
import { authService } from "@/service/auth.service";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await authService.login(data);
      const { access_token, username, email, role } = res.data.result;
      setAuth(access_token, { id: "", username, email, role });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      setError("root", { message: "Email atau password salah." });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
        <Lock size={16} className="text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-center text-[15px] font-medium mb-1">
          Selamat Datang Kembali
        </h2>
        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          Akses terbatas untuk mitra terdaftar.
          <br />
          Gunakan akun yang telah diberikan oleh tim kami.
        </p>
        <div className="w-6 h-0.5 bg-[var(--fandm-accent)] rounded-full mt-3" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Email</label>
          <div className="relative">
            <Mail
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
            <Input
              type="email"
              placeholder="email@fandm.id"
              autoComplete="email"
              className="pl-9 text-sm"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Password</label>
          <div className="relative">
            <Lock
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pl-9 pr-9 text-sm"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
            >
              {showPassword ? (
                <EyeOff size={14} strokeWidth={1.5} />
              ) : (
                <Eye size={14} strokeWidth={1.5} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        {errors.root && (
          <p className="text-xs text-destructive text-center">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
          {isSubmitting ? "Memproses..." : "→ Masuk"}
        </Button>
      </form>
      <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] text-muted-foreground">
        <Lock size={10} strokeWidth={1.5} />
        <span>Sistem ini hanya dapat diakses oleh pengguna yang diundang.</span>
      </div>
    </div>
  );
}

export default function FormLoginComponent() {
  const { accessToken } = useAuthStore();
  if (accessToken) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return (
    <>
      {/* ── Desktop ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gray-50 relative overflow-hidden gap-4">
        {/* KitchenWatermark */}
        <div className="absolute right-0 bottom-0 w-[420px] h-[480px] pointer-events-none select-none">
          <KitchenWatermark />
        </div>

        {/* Form card */}
        <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl border border-border p-8 shadow-sm">
          <LoginForm />
        </div>

        {/* Footer — di luar card */}
        <div className="relative z-10 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ShieldCheck size={13} className="shrink-0" />
            <span>Secure • Private • Internal Use Only</span>
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-1.5">
            © 2026 Tentic Studio. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Mobile ─────────────────────────────────────────────────── */}
      <BannerBackground
        variant="full"
        showRingTopRight={false}
        className="flex lg:hidden flex-1 flex-col"
      >
        {/* Area atas: logo + hero + KitchenWatermark */}
        <div className="relative flex-1 px-6 pt-10 overflow-hidden">
          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5 mb-5">
            <img src={logo} alt="FANDM" className="h-7 object-contain" />
            <span className="text-white font-semibold text-sm tracking-widest">
              FANDM
            </span>
          </div>
          {/* Hero */}
          <div className="relative z-10 mb-6">
            <h1 className="text-white text-5xl font-semibold font-serif leading-[1.2] tracking-[-0.5px] mb-6">
              Stok Aman,
              <br />
              Hati Tenang.
              <sup className="text-[28px] font-normal ml-1 align-super">°</sup>
            </h1>
            <div className="w-6 h-0.5 bg-[var(--fandm-accent)] rounded-full mt-3" />
          </div>
          <div className="relative z-10">
            <p className="text-[var(--fandm-border)] text-[15px] leading-relaxed max-w-xs mb-12">
              Jangan biarkan bahan baku terbuang sia-sia. Pantau inventaris
              secara real-time dan fokuslah pada apa yang kamu cintai: memasak.
            </p>
          </div>
        </div>

        {/* Form card + footer mobile */}
        <div className="relative z-10 px-4 pt-4 shrink-0">
          <div className="bg-white/[0.97] rounded-2xl p-6 shadow-lg">
            <LoginForm />
          </div>

          {/* Footer — di luar card, di dalam BannerBackground */}
          <div className="text-center py-4">
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-white/50">
              <ShieldCheck size={13} className="shrink-0" />
              <span>Secure • Private • Internal Use Only</span>
            </p>
            <p className="text-[11px] text-white/30 mt-1.5">
              © 2026 Tentic Studio. All rights reserved.
            </p>
          </div>
        </div>
      </BannerBackground>
    </>
  );
}
