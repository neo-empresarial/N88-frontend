"use client";

import { Link, LogOut, Pencil, Plus } from "lucide-react";
import { Button } from "./ui/button";
import AddMembersToGroupDialog from "./add-members-to-group-dialog";
import EditGroupNamePopover from "./edit-group-name-popover";
import RemoveMembersFromGroupDialog from "./remove-members-from-group-dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSession } from "@/lib/session";
import { useEffect, useState } from "react";
import LeaveGroupDialog from "./leave-group-dialog";

const MyGroupsCard = ({ group }: { group: any }) => {
  const queryClient = useQueryClient();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      const session = await getSession();
      if (session?.user?.id) {
        setIsOwner(group.createdBy === Number(session.user.id));
      }
    };
    checkOwner();
  }, [group.createdBy]);

  const handleLeaveGroup = async () => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`/api/groups/${group.id}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to leave group");
      }

      toast.success("Left group successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    } catch (error) {
      toast.error("Failed to leave group");
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {group.name}
            </h2>
            {isOwner && <EditGroupNamePopover groupId={group.id} />}
          </div>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {group.members?.length || 0} membros
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{group.description}</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex -space-x-2">
            {group.members?.slice(0, 3).map((member: any, index: number) => (
              <div
                key={member.iduser}
                className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center"
              >
                <span className="text-xs font-medium">{member.name[0]}</span>
              </div>
            ))}
            {group.members?.length > 3 && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center cursor-pointer">
                    <span className="text-xs font-medium">
                      +{group.members.length - 3}
                    </span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold">Todos os membros</h4>
                    <div className="flex flex-col gap-2">
                      {group.members?.map((member: any) => (
                        <div
                          key={member.iduser}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {member.name[0]}
                            </span>
                          </div>
                          <span className="text-sm">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {isOwner ? (
              <>
                <AddMembersToGroupDialog groupId={group.id} />
                <RemoveMembersFromGroupDialog groupId={group.id} />
              </>
            ) : (
              <LeaveGroupDialog onConfirm={handleLeaveGroup} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGroupsCard;
