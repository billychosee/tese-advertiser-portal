"use client";

import { useThemeContext } from "@/components/providers/ThemeProvider";

export function useTheme() {
  const context = useThemeContext();

  return {
    theme: context.theme,
    toggleTheme: context.toggleTheme,
    setLightTheme: () => context.setTheme("light"),
    setDarkTheme: () => context.setTheme("dark"),
    isDark: context.theme === "dark",
  };
}
