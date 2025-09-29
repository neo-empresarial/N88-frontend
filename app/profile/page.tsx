"use client";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MyGroupsCard from "@/components/my-groups-card";
import { Loader2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CreateGroupDialog from "@/components/create-group-dialog";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import EditProfileDialog from "@/components/edit-profile-dialog";
import { useState } from "react";

export default function Profile() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const useGroups = () => {
    return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}groups`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

        return response.json();
      },
      enabled: !!session?.accessToken,
    });
  };

  const { data: groups, isLoading } = useGroups();

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
              disabled={sessionLoading}
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
            {isLoading ? (
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
            ) : (
              <>
                {groups && groups.length > 0 ? (
                  groups.map((group: any) => (
                    <MyGroupsCard key={group.id} group={group} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Você ainda não participa de nenhum grupo.
                    </p>
                  </div>
                )}
                <div className="flex justify-center">
                  <CreateGroupDialog />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
