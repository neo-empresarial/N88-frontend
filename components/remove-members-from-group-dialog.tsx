import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/session";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, UserMinus } from "lucide-react";
import { getGroup } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface User {
  iduser: number;
  name: string;
  email: string;
}

const RemoveMembersFromGroupDialog = ({ groupId }: { groupId: number }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const queryClient = useQueryClient();

  const { data: group } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroup(groupId),
  });

  const handleRemoveMembers = async () => {
    try {
      const session = await getSession();
      if (!session?.user.accessToken) {
        throw new Error("No access token found");
      }

      for (const user of selectedUsers) {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}groups/${groupId}/members/${user.iduser}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.accessToken}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove member from group");
        }
      }

      toast.success("Membros removidos com sucesso");
      setSelectedUsers([]);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    } catch (error) {
      toast.error("Falha ao remover membros do grupo");
      console.error(error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <UserMinus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover membros do grupo</DialogTitle>
            <DialogDescription>
              Selecione os membros que deseja remover do grupo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Select
              onValueChange={(value) => {
                const user = group?.members?.find(
                  (member: User) => member.iduser === Number(value)
                );
                if (user) {
                  setSelectedUsers([...selectedUsers, user]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um membro para remover" />
              </SelectTrigger>
              <SelectContent>
                {group?.members?.map((member: User) => (
                  <SelectItem
                    key={member.iduser}
                    value={member.iduser.toString()}
                  >
                    {member.name} ({member.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">
                Membros selecionados:
              </h3>
              <div className="space-y-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.iduser}
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedUsers(
                          selectedUsers.filter((u) => u.iduser !== user.iduser)
                        )
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleRemoveMembers}
              disabled={selectedUsers.length === 0}
            >
              Remover membros selecionados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RemoveMembersFromGroupDialog;
