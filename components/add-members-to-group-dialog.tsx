"use client";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "@geist-ui/icons";
import { toast } from "sonner";
import { getSession } from "@/lib/session";

interface User {
  iduser: number;
  name: string;
  email: string;
}

const AddMembersToGroupDialog = ({ groupId }: { groupId: number }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }
      return response.json();
    },
  });

  const filteredUsers =
    users?.filter(
      (user: User) =>
        !selectedUsers.some((selected) => selected.iduser === user.iduser) &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

  const handleUserSelect = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((user) => user.iduser !== userId));
  };

  const handleAddMembers = async () => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }

      const memberIds = selectedUsers.map(user => user.iduser);
      
      for (const memberId of memberIds) {
        const response = await fetch(`http://localhost:8000/groups/${groupId}/members/${memberId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to add member to group");
        }
      }

      toast.success("Membros adicionados com sucesso");
      setSelectedUsers([]);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    } catch (error) {
      toast.error("Falha ao adicionar membros ao grupo");
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>Add members to the group</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a member"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-black border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredUsers.map((user: User) => (
                  <div
                    key={user.iduser}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500 text-ellipsis overflow-hidden">
                      {user.email}
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="px-4 py-2 text-gray-500">No users found</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {selectedUsers.map((user) => (
              <div
                key={user.iduser}
                className="flex items-center justify-between p-2 rounded-md"
              >
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500 text-ellipsis overflow-hidden">
                    {user.email}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveUser(user.iduser)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddMembers}
              disabled={selectedUsers.length === 0 || isLoading}
            >
              {isLoading ? (
                "Adicionando membros..."
              ) : (
                "Adicionar membros"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersToGroupDialog;
