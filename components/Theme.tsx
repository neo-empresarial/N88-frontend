"use client"

import { useTheme } from "next-themes";
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "./ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";

export default function Theme() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
      <DropdownMenuRadioItem value="light">
        <div className="flex justify-between">
          <Sun className="h-5 mr-1" />
          <span>Light</span>
        </div>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark">
        <div className="flex justify-between">
          <Moon className="h-5 mr-1" />
          <span>Dark</span>
        </div>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
}
