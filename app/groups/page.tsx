"use client";

import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/session";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Plus, UserPlus, Users } from "@geist-ui/icons";
import CreateGroupDialog from "@/components/create-group-dialog";
import MyGroupsCard from "@/components/my-groups-card";

const Groups = () => {
  const useGroups = () => {
    return useQuery({
      queryKey: ["groups"],
      queryFn: async () => {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}groups`, {
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

  const { data: groups, isLoading, error } = useGroups();
  console.log(groups);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="grid grid-cols-2 gap-2 w-2/3 h-2/3">
        <div className="flex flex-col h-full  rounded-lg p-6">
          <div className="flex flex-row justify-center items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">Seus grupos de estudos</h1>
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2">
            {groups &&
              groups.map((group: any) => (
                <MyGroupsCard key={group.id} group={group} />
              ))}
          </div>
        </div>

        <div className="flex flex-col h-full  rounded-lg p-6">
          <div className="flex flex-row justify-center items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">Crie um grupo de estudos</h1>
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <CreateGroupDialog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
