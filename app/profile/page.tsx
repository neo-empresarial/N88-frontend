"use client";
import { getSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MyGroupsCard from "@/components/my-groups-card";
import { Skeleton } from "@/components/ui/skeleton";
import CreateGroupDialog from "@/components/create-group-dialog";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function Profile() {
  const useGroups = () => {
    return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"}groups`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      return response.json();
    },
  });
  };

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
  });

  const { data: groups, isLoading, error } = useGroups();

  return (
    <div className="flex flex-col items-center h-screen p-5">
      <div className="grid grid-cols-[30%_70%] gap-10 w-full max-w-7xl">
        <div className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-fit">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarFallback className="bg-gray-500 dark:bg-gray-700">
                {session?.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-md max-h-195 overflow-y-auto">
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
                {groups &&
                  groups.map((group: any) => (
                    <MyGroupsCard key={group.id} group={group} />
                  ))}
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
