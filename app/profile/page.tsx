"use client";

import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MyGroupsCard from "@/components/my-groups-card";
import { Loader2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CreateGroupDialog from "@/components/create-group-dialog";
import EditProfileDialog from "@/components/edit-profile-dialog";
import { useState } from "react";
import { groupType } from "@/components/my-groups-card";

// Helper de fetch genérico para a app (client-side, same-site)
async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default function Profile() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1) Busca sessão via API interna (server-side)
  const {
    data: sessionData,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: () => getJson<{ ok: boolean; user?: any }>("/api/session"),
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const session = sessionData?.ok ? { user: sessionData.user } : null;

  // 2) Busca grupos apenas se autenticado
  const {
    data: groups,
    isLoading: groupsLoading,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      getJson<groupType[]>(
        // Se você tiver rewrite para o backend, use caminho relativo:
        // "/api/backend/groups"
        `${process.env.NEXT_PUBLIC_BACKEND_URL}groups`
      ),
    enabled: !!session?.user, // só depois que a sessão veio
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const handleProfileUpdated = async () => {
    await queryClient.invalidateQueries({ queryKey: ["session"] });
    await queryClient.refetchQueries({ queryKey: ["session"] });
  };

  return (
    <div className="flex flex-col items-center h-screen m-10">
      <div className="grid grid-cols-[30%_70%] gap-4 w-full max-w-7xl">
        <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-fit">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarFallback className="bg-gray-500 dark:bg-gray-700">
                  {session?.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                {sessionLoading ? (
                  <>
                    <Skeleton className="h-6 w-32 bg-gray-300" />
                    <Skeleton className="h-4 w-24 bg-gray-300 mt-1" />
                  </>
                ) : sessionError || !session ? (
                  <p className="text-sm text-red-500">Sessão inválida</p>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">
                      {session?.user?.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {session?.user?.course}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session?.user?.email}
                    </p>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md hover:scale-105 transition-all duration-200 ease-in-out"
              disabled={sessionLoading || !session}
              title="Editar perfil"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          {session && (
            <EditProfileDialog
              session={session}
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              onProfileUpdated={handleProfileUpdated}
            />
          )}
        </div>

        <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h1 className="text-2xl font-bold">Grupos</h1>
          <div className="flex flex-col gap-2 h-195">
            {groupsLoading ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Carregando grupos
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aguarde um momento...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <Skeleton className="h-20 w-full bg-gray-200 dark:bg-gray-600 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            ) : groups && groups.length > 0 ? (
              <>
                {groups.map((group: groupType) => (
                  <MyGroupsCard key={group.id} group={group} />
                ))}
                <div className="flex justify-center">
                  <CreateGroupDialog />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Você ainda não participa de nenhum grupo.
                </p>
                <div className="flex justify-center">
                  <CreateGroupDialog />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
