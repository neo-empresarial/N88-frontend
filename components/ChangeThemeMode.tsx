"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ChangeThemeMode() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {theme === "dark" ? (
        <Sun className="cursor-pointer h-5" onClick={() => setTheme("light")} />
      ) : (
        <Moon className="cursor-pointer h-5" onClick={() => setTheme("dark")} />
      )}
    </div>
  );
}
