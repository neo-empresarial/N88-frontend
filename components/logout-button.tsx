"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { removeMultipleFromStorage } from "@/app/schedule/utils/persistenceUtils";

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    const response = await fetch("/api/auth/signout", {
      method: "GET",
    });

    if (response.ok) {
      removeMultipleFromStorage([
        "plans_data",
        "schedule_subjects",
        "searched_subjects",
        "schedule_title",
        "current_schedule_id",
        "current_plan",
        "plans_initialized",
      ]);

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
