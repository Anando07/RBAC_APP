import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import type { Language } from "@/locales/translations";
import useAuth from "@/auth/store";

export interface OutletContextType {
  lang: Language;
  toggleLanguage: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function RootLayout() {
  const isLoggedIn = useAuth((state) => state.checkLogin());
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<"dark" | "light">("light");

  // Sync dark class on the html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "bn" : "en"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      <Toaster />
      {!isLoggedIn && (
        <Navbar
          lang={lang}
          onToggleLanguage={toggleLanguage}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      <Outlet context={{ lang, toggleLanguage, theme, toggleTheme } satisfies OutletContextType} />
    </div>
  );
}