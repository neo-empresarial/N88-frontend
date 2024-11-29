"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center cursor-pointer w-full text-red-500"
    >
      <LogOut className="w-5" />
      <span className="ml-2">Sair</span>
    </button>
  );
}
