"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeName =
  | "dark"
  | "light"
  | "ocean"
  | "forest"
  | "sunset"
  | "system";

export const AVAILABLE_THEMES: { value: ThemeName; label: string }[] = [
  { value: "dark", label: "Void Dark" },
  { value: "light", label: "Light Mode" },
  { value: "ocean", label: "Ocean Blue" },
  { value: "forest", label: "Forest Green" },
  { value: "sunset", label: "Sunset Orange" },
  { value: "system", label: "System Default" },
];

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  resolvedTheme: Exclude<ThemeName, "system">;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function getSystemPreference(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: ThemeName): Exclude<ThemeName, "system"> {
  return theme === "system" ? getSystemPreference() : theme;
}

function applyTheme(theme: ThemeName) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  // Remove any previous theme class to avoid stacking.
  root.classList.remove(
    "theme-dark",
    "theme-light",
    "theme-ocean",
    "theme-forest",
    "theme-sunset",
    "dark",
    "light"
  );

  // Add both a generic light/dark class (for Tailwind dark: utilities)
  // and a more specific theme-X class for custom palettes.
  root.classList.add(`theme-${resolved}`);
  root.classList.add(resolved === "light" ? "light" : "dark");
  root.dataset.theme = resolved;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [resolvedTheme, setResolvedTheme] =
    useState<Exclude<ThemeName, "system">>("dark");

  // Load saved theme on mount.
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeName) || "dark";
    setThemeState(saved);
  }, []);

  // Apply theme whenever it changes; also follow system pref when "system".
  useEffect(() => {
    applyTheme(theme);
    setResolvedTheme(resolveTheme(theme));
    localStorage.setItem("theme", theme);

    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      applyTheme("system");
      setResolvedTheme(resolveTheme("system"));
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (next: ThemeName) => setThemeState(next);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
