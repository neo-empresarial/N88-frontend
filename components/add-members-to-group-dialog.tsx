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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { X } from "@geist-ui/icons";
import { toast } from "sonner";
import { getSession } from "@/lib/session";

interface User {
  iduser: number;
  name: string;
  email: string;
}

const AddMembersToGroupDialog = ({ groupId }: { groupId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
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

  const { mutate: sendInvitations, isPending } = useMutation({
    mutationFn: async () => {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }

      const promises = selectedUsers.map((user) =>
        fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientId: user.iduser,
            groupId: groupId,
          }),
        })
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Invitations sent successfully");
      setSelectedUsers([]);
      setSearchTerm("");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error("Failed to send invitations");
      console.error(error);
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

  const handleSendInvitations = () => {
    if (selectedUsers.length === 0) return;
    sendInvitations();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Send invitations to join the group
          </DialogDescription>
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
              disabled={isPending}
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

          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.iduser}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{user.name}</span>
                  <button
                    onClick={() => handleRemoveUser(user.iduser)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    disabled={isPending}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={handleSendInvitations}
              disabled={selectedUsers.length === 0 || isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Invitations"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersToGroupDialog;
