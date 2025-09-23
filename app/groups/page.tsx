"use client";

import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/session";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, UserPlus, Users, Search, UserMinus, UserCheck, UserX } from "@geist-ui/icons";
import CreateGroupDialog from "@/components/create-group-dialog";
import MyGroupsCard from "@/components/my-groups-card";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-toastify";

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const useGroups = () => {
    return useQuery({
      queryKey: ["groups"],
      queryFn: async () => {
        const response = await fetchWithAuth(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
          }groups`,
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

  const useFriends = () => {
    return useQuery({
      queryKey: ["friends"],
      queryFn: async () => {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
          }friends`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }

        return response.json();
      },
    });
  };

  const usePendingRequests = () => {
    return useQuery({
      queryKey: ["pendingRequests"],
      queryFn: async () => {
        const session = await getSession();
        if (!session?.accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
          }friends/pending`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch pending requests");
        }

        return response.json();
      },
    });
  };

  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: friends, isLoading: friendsLoading, refetch: refetchFriends } = useFriends();
  const { data: pendingRequests, isLoading: pendingLoading, refetch: refetchPending } = usePendingRequests();

const searchUsers = async (term: string) => {
  if (!term.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    const session = await getSession();
    if (!session?.accessToken) return;

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
      }friends/search?q=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.ok) {
      const results = await response.json();
      setSearchResults(results);
    } else {
      console.error("Search failed:", response.status);
      toast.error("Erro ao buscar usuários");
    }
  } catch (error) {
    console.error("Error searching users:", error);
    toast.error("Erro ao buscar usuários");
  }
};

const sendFriendRequest = async (friendId: number) => {
  try {
    const session = await getSession();
    if (!session?.accessToken) return;

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
      }friends/${friendId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      toast.success("Solicitação de amizade enviada!");
      setSearchResults([]);
      setSearchTerm("");
      refetchPending();
    } else {
      console.error("Failed to send friend request:", response.status, response.statusText);
      toast.error("Erro ao enviar solicitação");
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    toast.error("Erro ao enviar solicitação");
  }
};

  const acceptFriendRequest = async (friendshipId: number) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) return;

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/accept/${friendshipId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Amigo adicionado!");
        refetchFriends(); 
        refetchPending();
      } else {
        toast.error("Erro ao aceitar solicitação");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Erro ao aceitar solicitação");
    }
  };

  const removeFriend = async (friendId: number) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) return;

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Amigo removido!");
        refetchFriends(); 
      } else {
        toast.error("Erro ao remover amigo");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Erro ao remover amigo");
    }
  };

  const { data: groups, isLoading, error } = useGroups();

  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: friends, isLoading: friendsLoading, refetch: refetchFriends } = useFriends();
  const { data: pendingRequests, isLoading: pendingLoading, refetch: refetchPending } = usePendingRequests();

const searchUsers = async (term: string) => {
  if (!term.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    const session = await getSession();
    if (!session?.accessToken) return;

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
      }friends/search?q=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.ok) {
      const results = await response.json();
      setSearchResults(results);
    } else {
      console.error("Search failed:", response.status);
      toast.error("Erro ao buscar usuários");
    }
  } catch (error) {
    console.error("Error searching users:", error);
    toast.error("Erro ao buscar usuários");
  }
};

const sendFriendRequest = async (friendId: number) => {
  try {
    const session = await getSession();
    if (!session?.accessToken) return;

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
      }friends/${friendId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      toast.success("Solicitação de amizade enviada!");
      setSearchResults([]);
      setSearchTerm("");
      refetchPending();
    } else {
      console.error("Failed to send friend request:", response.status, response.statusText);
      toast.error("Erro ao enviar solicitação");
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    toast.error("Erro ao enviar solicitação");
  }
};

  const acceptFriendRequest = async (friendshipId: number) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) return;

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/accept/${friendshipId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Amigo adicionado!");
        refetchFriends(); 
        refetchPending();
      } else {
        toast.error("Erro ao aceitar solicitação");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Erro ao aceitar solicitação");
    }
  };

  const removeFriend = async (friendId: number) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) return;

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Amigo removido!");
        refetchFriends(); 
      } else {
        toast.error("Erro ao remover amigo");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Erro ao remover amigo");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="grid grid-cols-3 gap-4 w-4/5 h-2/3">
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex flex-row justify-center items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">Seus grupos de estudos</h1>
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {groupsLoading ? (
              <p>Carregando grupos...</p>
            ) : groups && groups.length > 0 ? (
              groups.map((group: any) => (
                <MyGroupsCard key={group.id} group={group} />
              ))
            ) : (
              <p className="text-gray-500">Nenhum grupo encontrado</p>
            )}
          </div>
        </div>
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex flex-row justify-center items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">Crie um grupo de estudos</h1>
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <CreateGroupDialog />
          </div>
        </div>

        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex flex-row justify-center items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold">Gerenciar amizades</h1>
            <UserPlus className="w-6 h-6" />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Adicionar amigos</h2>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchUsers(e.target.value);
                }}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => searchUsers(searchTerm)}
                disabled={!searchTerm.trim()}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {searchResults.map((user: any) => (
                  <Card key={user.iduser} className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendFriendRequest(user.iduser)}
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {pendingRequests && pendingRequests.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Solicitações pendentes</h2>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {pendingRequests.map((request: any) => (
                  <Card key={request.id} className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {request.sender?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{request.sender?.name}</p>
                          <p className="text-xs text-gray-500">Quer ser seu amigo</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acceptFriendRequest(request.id)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFriend(request.sender?.iduser)}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Seus amigos</h2>
            <div className="space-y-2 overflow-y-auto max-h-48">
              {friendsLoading ? (
                <p>Carregando amigos...</p>
              ) : friends && friends.length > 0 ? (
                friends.map((friend: any) => (
                  <Card key={friend.iduser} className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {friend.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{friend.name}</p>
                          <p className="text-xs text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFriend(friend.iduser)}
                          title="Remover amigo"
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.info("Funcionalidade em desenvolvimento");
                          }}
                          title="Adicionar a grupo"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Nenhum amigo encontrado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;