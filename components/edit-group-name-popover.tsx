import { Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { PopoverTrigger } from "./ui/popover";
import { Pencil } from "lucide-react";
import { Input } from "./ui/input";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/session";
import { toast } from "sonner";

interface UpdateGroupNameData {
  groupId: string;
  name: string;
}

const useUpdateGroupName = () => {
  return useMutation({
    mutationFn: async ({ groupId, name }: UpdateGroupNameData) => {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(`http://localhost:8000/groups/${groupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ name }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update group name");
      }

      return response.json();
    },
  });
};

const EditGroupNamePopover = ({ groupId }: { groupId: string }) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const { mutate: updateGroupName } = useUpdateGroupName();
  const handleSave = () => {
    if (name.length > 0) {
      updateGroupName(
        { groupId, name },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            toast.success("Nome do grupo atualizado");
            setName(""); 
          },
          onError: (error) => {
            toast.error("Falha ao atualizar o nome do grupo");
          }
        }
      );
    } else {
      toast.error("Group name cannot be empty");
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="icon" className="bg-transparent dark:bg-gray-800">
          <Pencil className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 flex flex-col gap-2">
        <Input type="text" placeholder="Edit Group Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button
          className="w-1/3 ml-auto mt-4"
          onClick={handleSave}
        >
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default EditGroupNamePopover;