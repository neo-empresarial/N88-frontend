"use client";

import { Link, Pencil, Plus } from "lucide-react";
import { Button } from "./ui/button";
import AddMembersToGroupDialog from "./add-members-to-group-dialog";
import EditGroupNamePopover from "./edit-group-name-popover";

const MyGroupsCard = ({ group }: { group: any }) => {
  console.log(group);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {group.name}
            </h2>
            <EditGroupNamePopover groupId={group.id} />
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
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <span className="text-xs font-medium">
                  +{group.members.length - 3}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <AddMembersToGroupDialog groupId={group.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGroupsCard;
