import { Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { PopoverTrigger } from "./ui/popover";
import { Loader2, Pencil } from "lucide-react";
import { Input } from "./ui/input";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface UpdateGroupNameData {
  groupId: string;
  name: string;
}

const useUpdateGroupName = () => {
  return useMutation({
    mutationFn: async ({ groupId, name }: UpdateGroupNameData) => {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }groups/${groupId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update group name");
      }

      return response.json();
    },
  });
};

const EditGroupNamePopover = ({ groupId }: { groupId: string }) => {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: updateGroupName, isPending } = useUpdateGroupName();

  const handleSave = () => {
    if (name.length > 0) {
      updateGroupName(
        { groupId, name },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            toast.success("Nome do grupo atualizado");
            setName("");
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error("Falha ao atualizar o nome do grupo");
          },
        }
      );
    } else {
      toast.error("O nome do grupo não pode ser vazio");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent dark:bg-gray-800"
        >
          <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Atualizar nome do grupo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
        />
        <Button
          className="w-1/3 ml-auto mt-4 bg-blue-500 hover:bg-blue-600"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            "Atualizar"
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default EditGroupNamePopover;
