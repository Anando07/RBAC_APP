import React from "react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router";
import useAuth from "@/auth/store";
import { translations, type Language } from "@/locales/translations";
import { Globe, Home, Info, Image as ImageIcon, FileText, Sun, Moon } from "lucide-react";

interface NavbarProps {
  lang: Language;
  onToggleLanguage: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Navbar({ lang, onToggleLanguage, theme, onToggleTheme }: NavbarProps) {
  const checkLogin = useAuth((state) => state.checkLogin);
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const t = translations[lang];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 border-b border-border backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Brand */}
      <NavLink to="/" className="font-bold flex items-center gap-3 text-xl tracking-wider uppercase text-foreground">
        <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black">
          A
        </span>
        <span>{t.brand}</span>
      </NavLink>

      {/* Main Navigation */}
      <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <NavLink to="/" className={({ isActive }) => (isActive ? "text-foreground font-semibold" : "hover:text-foreground transition-colors flex items-center gap-1.5")}>
          <Home className="w-4 h-4" /> {t.nav.home}
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "text-foreground font-semibold" : "hover:text-foreground transition-colors flex items-center gap-1.5")}>
          <Info className="w-4 h-4" /> {t.nav.about}
        </NavLink>
        <NavLink to="/gallery" className={({ isActive }) => (isActive ? "text-foreground font-semibold" : "hover:text-foreground transition-colors flex items-center gap-1.5")}>
          <ImageIcon className="w-4 h-4" /> {t.nav.gallery}
        </NavLink>
        <NavLink to="/notice" className={({ isActive }) => (isActive ? "text-foreground font-semibold" : "hover:text-foreground transition-colors flex items-center gap-1.5")}>
          <FileText className="w-4 h-4" /> {t.nav.notice}
        </NavLink>
         <NavLink to="/contact" className={({ isActive }) => (isActive ? "text-foreground font-semibold" : "hover:text-foreground transition-colors flex items-center gap-1.5")}>
          <FileText className="w-4 h-4" /> {t.nav.contact}
        </NavLink>
      
      </div>

      {/* Toggles & Auth Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleTheme}
          className="rounded-full flex items-center gap-2 cursor-pointer"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
        </Button>

        {/* Language Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLanguage}
          className="rounded-full flex items-center gap-2 cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          {lang === "en" ? "বাংলা" : "English"}
        </Button>

        {/* Auth Actions */}
        {checkLogin() ? (
          <>
            <NavLink to="/dashboard/profile" className="text-sm font-medium text-foreground hover:underline">
              {user?.name}
            </NavLink>
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              size="sm"
              variant="outline"
              className="rounded-full cursor-pointer"
            >
              {t.nav.logout}
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <Button size="sm" variant="outline" className="rounded-full cursor-pointer">
                {t.nav.login}
              </Button>
            </NavLink>
            <NavLink to="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90 rounded-full font-semibold px-5 cursor-pointer">
                {t.nav.signup}
              </Button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}