"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export default function Theme() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (isChecked: boolean) => {
    setTheme(isChecked ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="theme-switch">
        <Sun className="h-5 mr-1" />
      </Label>
      <Switch
        id="theme-switch"
        checked={theme === "dark"}
        onCheckedChange={handleThemeChange}
      />
      <Label htmlFor="theme-switch">
        <Moon className="h-5 mr-1" />
      </Label>
    </div>
    // <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
    //   <DropdownMenuRadioItem value="light">
    //     <div className="flex justify-between">
    //       <Sun className="h-5 mr-1" />
    //       <span>Light</span>
    //     </div>
    //   </DropdownMenuRadioItem>
    //   <DropdownMenuRadioItem value="dark">
    //     <div className="flex justify-between">
    //       <Moon className="h-5 mr-1" />
    //       <span>Dark</span>
    //     </div>
    //   </DropdownMenuRadioItem>
    //   <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
    // </DropdownMenuRadioGroup>
  );
}
