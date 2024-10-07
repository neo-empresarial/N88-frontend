"use client";

import * as React from "react";
import { Moon, Sun, Bolt } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChangeThemeMode() {
  const { theme, setTheme } = useTheme();

  // return (
  //   <div>
  //     {theme === "dark" ? (
  //       <Sun className="cursor-pointer h-5" onClick={() => setTheme("light")} />
  //     ) : (
  //       <Moon className="cursor-pointer h-5" onClick={() => setTheme("dark")} />
  //     )}
  //   </div>
  // );

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Bolt className="cursor-pointer h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <div className="w-full flex justify-between">
              <span>Light</span>
              <Sun className="h-5" />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <div className="w-full flex justify-between">
              <span>Dark</span>
              <Moon className="h-5" />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
