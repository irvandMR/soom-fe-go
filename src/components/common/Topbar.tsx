import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CalendarIcon,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ROUTES } from "@/constant/routes";
import { useAuthStore } from "@/store/useAuthStore";

interface TopbarProps {
  breadcrumb: string[];
}

export default function Topbar({ breadcrumb }: TopbarProps) {
  const { collapsed, toggle } = useSidebarStore();
  const { isMobile } = useBreakpoint();
  const { user, clearAuth } = useAuthStore();
  // const user = { role: "admin", username: "Rizky", email: "rizky@gmail.com" };

  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN);
  };
  return (
    <header
      className={cn(
        "h-[var(--topbar-height)] bg-[var(--topbar-bg)] flex items-center px-5 gap-3 fixed top-0 right-0 z-[99] transition-[left] duration-200 ease-in-out shadow-[0_1px_0_var(--fandm-border)]",
        isMobile
          ? "left-0"
          : collapsed
            ? "left-[var(--sidebar-collapsed)]"
            : "left-[var(--sidebar-width)]",
      )}
    >
      {/* Mobile — hamburger */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-md text-[var(--fandm-text-muted)] border-[var(--fandm-border)] shrink-0"
          onClick={toggle}
        >
          <Menu size={16} />
        </Button>
      )}

      {/* Breadcrumb */}
      <div className="flex-1 flex items-center gap-1.5 text-xs text-[var(--fandm-text-muted)] overflow-hidden">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
            {i > 0 && (
              <span className="text-[var(--fandm-border)] text-sm">›</span>
            )}
            <span
              className={
                i === breadcrumb.length - 1
                  ? "text-[var(--fandm-text-dark)] font-medium text-[13px]"
                  : ""
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Date — hide on mobile */}
        {!isMobile && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--fandm-border)] rounded-md bg-white text-xs text-[var(--fandm-text-dark)] font-medium cursor-pointer">
            <CalendarIcon size={14} className="text-slate-500" />
            Hari ini
            <ChevronDown size={12} className="text-slate-400 ml-1" />
          </div>
        )}

        {/* Notification */}
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-md border-[var(--fandm-border)] relative"
        >
          <Bell size={14} className="text-[var(--fandm-text-muted)]" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        </Button>

        {/* Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md border border-[var(--fandm-border)] bg-white hover:bg-slate-50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-[var(--fandm-primary-light)] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {user?.username?.charAt(0).toUpperCase() ?? "A"}
              </div>
              {!isMobile && (
                <span className="text-xs font-medium text-[var(--fandm-text-dark)] whitespace-nowrap">
                  {user?.username ?? "Admin FANDM"}
                </span>
              )}
              <ChevronDown
                size={12}
                className="text-[var(--fandm-text-muted)]"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 p-1 border-[var(--fandm-border)] rounded-xl shadow-lg mt-1"
          >
            <DropdownMenuLabel className="p-3 pb-2 border-b border-[var(--fandm-border)] mb-1">
              <div className="text-[13px] font-semibold text-[var(--fandm-text-dark)]">
                {user?.username ?? "Admin"}
              </div>
              <div className="text-[11px] text-[var(--fandm-text-muted)] mt-0.5">
                {user?.email ?? ""}
              </div>
              <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded bg-[#E3F2FB] text-[#1565A0] font-medium">
                {user?.role ?? "admin"}
              </span>
            </DropdownMenuLabel>

            <div className="px-2 py-1 text-[10px] font-semibold text-[var(--fandm-text-muted)] uppercase tracking-widest mt-1">
              Akun
            </div>

            <DropdownMenuItem
              className="text-xs text-[var(--fandm-text-dark)] py-2 px-2.5 cursor-pointer rounded-md focus:bg-[var(--fandm-bg-light)]"
              onClick={() => navigate(ROUTES.PROFILE)}
            >
              <User size={14} className="text-[var(--fandm-text-muted)] mr-2" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-xs text-[var(--fandm-text-dark)] py-2 px-2.5 cursor-pointer rounded-md focus:bg-[var(--fandm-bg-light)]"
              onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
            >
              <KeyRound
                size={14}
                className="text-[var(--fandm-text-muted)] mr-2"
              />
              Ganti Password
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[var(--fandm-border)] my-1" />

            <DropdownMenuItem
              className="text-xs text-red-500 py-2 px-2.5 cursor-pointer rounded-md focus:bg-red-50 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={14} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
