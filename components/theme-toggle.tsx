"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "ai-trade-journal-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-hover"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Z" />
          <path d="M12 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z" />
          <path d="m5.64 6.64.7.7a1 1 0 0 1-1.42 1.42l-.7-.7a1 1 0 0 1 1.42-1.42Z" />
          <path d="m18.36 19.36.7.7a1 1 0 1 1-1.42 1.42l-.7-.7a1 1 0 0 1 1.42-1.42Z" />
          <path d="M3 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" />
          <path d="M19 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1Z" />
          <path d="m5.64 17.36-.7.7a1 1 0 0 1-1.42-1.42l.7-.7a1 1 0 1 1 1.42 1.42Z" />
          <path d="m18.36 4.64-.7.7a1 1 0 1 1-1.42-1.42l.7-.7a1 1 0 0 1 1.42 1.42Z" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3c-.27.9-.41 1.84-.41 2.79a9 9 0 0 0 10.2 9Z" />
        </svg>
      )}
    </button>
  );
}
