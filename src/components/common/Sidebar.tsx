import { MENUS } from "@/constant/menu";
import { ROUTES } from "@/constant/routes";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import BannerBackground from "./BannerBackground";
import logo from "@/assets/image.png";

function NavItem({
  path,
  label,
  icon: Icon,
  exact = false,
  collapsed,
  onClose,
}: {
  path: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  collapsed: boolean;
  onClose?: () => void;
}) {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === path
    : location.pathname.startsWith(path);

  return (
    <NavLink
      to={path}
      end={exact}
      onClick={onClose}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-2.5 mx-1.5 my-0.5 rounded-lg text-[13px] transition-all duration-150 no-underline group",
        collapsed ? "py-2.5 justify-center px-2" : "py-2 px-3.5",
        isActive
          ? "bg-white text-[var(--fandm-text)] font-medium"
          : "text-white/50 hover:bg-white/[0.07] hover:text-white/85",
      )}
    >
      <Icon size={15} strokeWidth={1.5} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────
function SidebarContent({
  collapsed,
  onClose,
}: {
  collapsed: boolean;
  onClose?: () => void;
}) {
  //   const { user } = useAuthStore()
  const user = { role: "admin", name: "Rizky", email: "rizky@gmail.com" };
  const role = user?.role ?? "all";
  const initials =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const filtered = MENUS.filter(
    (g) => g.permission === "all" || g.permission === role,
  );

  return (
    <>
      {/* Logo */}
      <div
        className={cn(
          "h-14 flex items-center shrink-0 gap-2.5 border-b border-white/[0.06]",
          collapsed ? "px-3 justify-center" : "px-5",
        )}
      >
        <img src={logo} alt="FANDM" className="h-7 object-contain shrink-0" />
        {!collapsed && (
          <span className="text-white font-semibold text-sm tracking-widest whitespace-nowrap">
            SOOM
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {filtered.map((group, i) => (
          <div key={group.label}>
            {i > 0 && <div className="h-1" />}

            {!collapsed && (
              <p className="text-[9px] font-semibold uppercase tracking-widest text-white/30 px-5 pt-3 pb-1">
                {group.label}
              </p>
            )}

            {group.items.map((item) => (
              <NavItem
                key={item.path}
                {...item}
                collapsed={collapsed}
                onClose={onClose}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Docs link */}
      <div className="px-1.5 pb-1">
        <NavItem
          path={ROUTES.DOCS}
          label="Dokumentasi"
          icon={BookOpen}
          collapsed={collapsed}
          onClose={onClose}
        />
      </div>

      {/* User footer */}
      <div
        className={cn(
          "border-t border-white/[0.06] py-3 flex items-center gap-2.5",
          collapsed ? "px-3 justify-center" : "px-4",
        )}
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-[#d2ac79] flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-semibold">
            {initials}
          </span>
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate leading-tight">
              {user?.name ?? "Admin"}
            </p>
            <p className="text-white/40 text-[10px] truncate">{user?.email}</p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Sidebar Shell ────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const { isMobile } = useBreakpoint();

  // ── Mobile: overlay drawer ─────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Overlay backdrop */}
        {!collapsed && (
          <div
            onClick={toggle}
            className="fixed inset-0 bg-black/45 z-[100]"
            aria-hidden="true"
          />
        )}

        <aside
          aria-label="Sidebar navigasi"
          className={cn(
            "fixed top-0 left-0 h-screen w-56 flex flex-col z-[101]",
            "transition-transform duration-200 ease-in-out",
            collapsed ? "-translate-x-full" : "translate-x-0",
          )}
        >
          <BannerBackground variant="subtle" className="flex-1">
            <SidebarContent collapsed={false} onClose={toggle} />
          </BannerBackground>
        </aside>
      </>
    );
  }

  // ── Desktop: fixed sidebar dengan toggle collapse ──────────────────────────
  return (
    <aside
      aria-label="Sidebar navigasi"
      className={cn(
        "fixed top-0 left-0 h-screen flex flex-col shrink-0 z-[101]",
        "transition-[width] duration-200 ease-in-out overflow-visible",
        collapsed ? "w-[60px]" : "w-[220px]",
      )}
    >
      <BannerBackground
        variant="subtle"
        className="flex-1"
        showDotTopRight={false}
        showRingTopRight={true}
      >
        <SidebarContent collapsed={collapsed} />
      </BannerBackground>

      {/* Tombol toggle collapse */}
      <button
        onClick={toggle}
        aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        className={cn(
          "absolute top-[18px] -right-3.5 w-7 h-7 rounded-full",
          "bg-[#354F67] border-none cursor-pointer z-[102]",
          "flex items-center justify-center text-white/80",
          "shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform",
        )}
      >
        {collapsed ? (
          <ChevronRight size={12} strokeWidth={2} />
        ) : (
          <ChevronLeft size={12} strokeWidth={2} />
        )}
      </button>
    </aside>
  );
}
