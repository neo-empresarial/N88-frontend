"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    const response = await fetch("/api/auth/signout", {
      method: "GET",
    });

    if (response.ok) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center cursor-pointer w-full text-red-500"
    >
      <LogOut className="w-5" />
      <span className="ml-2">Sair</span>
    </button>
  );
}
