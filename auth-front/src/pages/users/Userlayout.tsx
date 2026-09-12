import { useState } from "react";
import { Navigate, Outlet, NavLink, useLocation, useNavigate, useOutletContext } from "react-router";
import useAuth from "@/auth/store";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  ChevronLeft,
  ChevronRight,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { translations } from "@/locales/translations";
import type { OutletContextType } from "@/pages/RootLayout";

function Userlayout() {
  const checkLogin = useAuth((state) => state.checkLogin);
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLanguage, theme, toggleTheme } = useOutletContext<OutletContextType>();
  const t = translations[lang];

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Guard clause for unauthenticated users
  if (!checkLogin()) {
    return <Navigate to="/login" replace />;
  }

  const canManageUsers = user?.roles?.some((role) =>
    ["ADMIN", "ROLE_ADMIN", "ROLE_ADMINISTRATOR", "ROLE_GUEST"].includes(
      role.name.toUpperCase()
    )
  );
  const primaryRole = user?.roles?.[0]?.name?.replace(/^ROLE_/, "") || "USER";
  const pageTitle = location.pathname.endsWith("/users")
    ? t.dashboard.users
    : location.pathname.endsWith("/profile")
      ? t.dashboard.profile
      : t.dashboard.overview;

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  const navItems = [
    { label: t.dashboard.sidebar[0], path: "/dashboard", icon: LayoutDashboard },
    ...(canManageUsers
      ? [{ label: t.dashboard.users, path: "/dashboard/users", icon: Users }]
      : []),
    { label: t.dashboard.settings, path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/30 text-foreground">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 md:static ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-20" : "md:w-64"} w-64`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="truncate font-bold text-lg tracking-tight">Access hub</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {(!isCollapsed || isMobileOpen) && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="border-t border-border p-3 space-y-2">
          {(!isCollapsed || isMobileOpen) && user && (
            <div className="px-2 py-1.5 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name || "User Account"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className={`w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive ${
              isCollapsed && !isMobileOpen ? "px-3" : "px-3"
            }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="ml-3">{t.dashboard.logout}</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t.dashboard.workspace}
              </p>
              <h1 className="text-lg font-semibold tracking-tight">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="inline-flex rounded-full gap-2"
            >
              <Globe className="h-4 w-4" />
              {t.dashboard.language}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
              {primaryRole}
            </span>
            <Button variant="outline" size="icon" className="relative rounded-full">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <Outlet context={{ lang, toggleLanguage, theme, toggleTheme }} />
        </main>
      </div>
    </div>
  );
}

export default Userlayout;