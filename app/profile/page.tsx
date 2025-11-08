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

import { groupType } from "@/components/my-groups-card";

export default function Profile() {
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
      enabled: !!session,
    });
  };

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
  });

  const { data: groups, isLoading } = useGroups();

  const queryClient = useQueryClient();

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
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h1 className="text-2xl font-bold">Grupos</h1>
          <div className="flex flex-col gap-2 h-195">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ) : (
              <>
                {groups && groups.length > 0 ? (
                  groups.map((group: groupType) => (
                    <MyGroupsCard key={group.id} group={group} />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Você ainda não participa de grupos.
                  </p>
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