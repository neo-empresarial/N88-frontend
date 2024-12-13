"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/api/auth/signout")}
      className="flex items-center cursor-pointer w-full text-red-500"
    >
      <LogOut className="w-5" />
      <span className="ml-2">Sair</span>
    </button>
  );
}
