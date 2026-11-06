import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "shop_theme";

function loadTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light"; // localStorage მიუწვდომელია (მაგ. private რეჟიმი)
  }
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(loadTheme); // lazy init

  // თემა შეიცვალა → <html>-ზე კლასი + localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // შენახვა ვერ მოხერხდა: თემა მაინც მუშაობს ამ სესიაში
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return { theme, toggleTheme };
}
