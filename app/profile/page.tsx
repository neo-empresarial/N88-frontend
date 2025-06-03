"use client";
import { getSession } from "@/lib/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MyGroupsCard from "@/components/my-groups-card";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// const session = {
//   user: {
//     id: "2",
//     name: "Gustavo Torres",
//     email: "gustavo@gmail.com",
//   },
//   iat: 1748365008,
//   exp: 1748969808,
// };

export default function Profile() {
  
  const useGroups = () => {
    return useQuery({
      queryKey: ["groups"],
      queryFn: async () => {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch("http://localhost:8000/groups", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }

        return response.json();
      },
    });
  };

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: () => getSession()
  });

  const { data: groups, isLoading, error } = useGroups();

  return (
    <div className="flex flex-col items-center h-screen m-10">
      <div className="grid grid-cols-[30%_70%] gap-4 w-full max-w-7xl">
        <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src={session?.user?.avatar} />
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
        <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h1 className="text-2xl font-bold">Grupos</h1>
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ) : (
              groups &&
              groups.map((group: any) => (
                <MyGroupsCard key={group.id} group={group} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
