"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {

    const response = await fetch("/api/auth/signout", {
      method: "GET",
    });

    if (response.ok) {
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.clear();
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
