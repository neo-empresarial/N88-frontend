"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, UserPlus, Users, Search, UserMinus, UserCheck, UserX, UserPlus2 } from "lucide-react";
import CreateGroupDialog from "@/components/create-group-dialog";
import MyGroupsCard from "@/components/my-groups-card";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  interface Friend {
    iduser: number;
    name: string;
    email: string;
  }
  
  interface PendingRequest {
    id: number;
    requester: Friend;
  }

  const [selectedFriendForGroup, setSelectedFriendForGroup] = useState<Friend | null>(null);
  const [isAddToGroupOpen, setIsAddToGroupOpen] = useState(false);

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
          throw new Error("Falha ao buscar grupos");
        }

        return response.json();
      },
    });
  };

  const useFriends = () => {
    return useQuery({
      queryKey: ["friends"],
      queryFn: async () => {
        const response = await fetchWithAuth(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
          }friends`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar amigos");
        }

        return response.json();
      },
    });
  };

  const usePendingRequests = () => {
    return useQuery({
      queryKey: ["pendingRequests"],
      queryFn: async () => {
        const response = await fetchWithAuth(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
          }friends/pending`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar solicitações pendentes");
        }

        return response.json();
      },
    });
  };

  const { data: groups, isLoading: groupsLoading, refetch: refetchGroups } = useGroups();
  const { data: friends, isLoading: friendsLoading, refetch: refetchFriends } = useFriends();
  const { data: pendingRequests, refetch: refetchPending } = usePendingRequests();

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
  
    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/search?q=${encodeURIComponent(term)}`,
        {
          credentials: "include",
        }
      );
  
      if (response.ok) {
        const results = await response.json();
        
        const filteredResults = results.filter((user: Friend) => {
          const isAlreadyFriend = friends?.some((friend: Friend) => friend.iduser === user.iduser);
          
          const hasPendingRequest = pendingRequests?.some((request: any) => 
            request.requester?.iduser === user.iduser
          );
          
          return !isAlreadyFriend && !hasPendingRequest;
        });
        
        setSearchResults(filteredResults);
      } else {
        toast.error("Erro ao buscar usuários");
      }
    } catch (error) {
      toast.error("Erro ao buscar usuários");
    }
  };

  const sendFriendRequest = async (friendId: number) => {
    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/${friendId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
  
      if (response.ok) {
        toast.success("Solicitação de amizade enviada!");
        setSearchResults([]);
        setSearchTerm("");
        refetchPending();
      } else {
        const errorData = await response.json();
        
        if (errorData.message === "Friendship already exists") {
          toast.warning("Vocês já são amigos ou há uma solicitação pendente!");
        } else if (errorData.message === "Cannot add yourself as friend") {
          toast.error("Você não pode adicionar a si mesmo como amigo!");
        } else {
          toast.error("Erro ao enviar solicitação");
        }
      }
    } catch (error) {
      toast.error("Erro ao enviar solicitação");
    }
  };

  const acceptFriendRequest = async (friendshipId: number) => {
    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/accept/${friendshipId}`,
        {
          method: "POST",
          credentials: "include",
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
      toast.error("Erro ao aceitar solicitação");
    }
  };

  const declineFriendRequest = async (friendshipId: number) => {
    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/decline/${friendshipId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Solicitação recusada!");
        refetchPending();
      } else {
        toast.error("Erro ao recusar solicitação");
      }
    } catch (error) {
      toast.error("Erro ao recusar solicitação");
    }
  };

  const removeFriend = async (friendId: number) => {
    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }friends/${friendId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Amigo removido!");
        refetchFriends(); 
      } else {
        toast.error("Erro ao remover amigo");
      }
    } catch (error) {
      toast.error("Erro ao remover amigo");
    }
  };

  const addFriendToGroup = async (friendId: number, groupId: number) => {
    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
        }groups/${groupId}/members/${friendId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Amigo adicionado ao grupo!");
        setIsAddToGroupOpen(false);
        setSelectedFriendForGroup(null);
        refetchGroups(); // Atualizar a lista de grupos
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao adicionar amigo ao grupo");
      }
    } catch (error) {
      toast.error("Erro ao adicionar amigo ao grupo");
    }
  };

  const getUserRelationshipStatus = (user: any) => {
    const isAlreadyFriend = friends?.some((friend: any) => friend.iduser === user.iduser);
    if (isAlreadyFriend) return 'friend';
    
    const hasIncomingRequest = pendingRequests?.some((request: any) => 
      request.requester?.iduser === user.iduser
    );
    if (hasIncomingRequest) return 'incoming';
    
    return 'none';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Grupos e Amigos</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Encontrar Amigos</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar usuários por nome ou email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchUsers(e.target.value);
              }}
              className="pl-10"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {searchResults.map((user: any) => {
                const relationshipStatus = getUserRelationshipStatus(user);
                
                return (
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
                          {relationshipStatus === 'friend' && (
                            <p className="text-xs text-green-600">Já é seu amigo</p>
                          )}
                          {relationshipStatus === 'incoming' && (
                            <p className="text-xs text-blue-600">Solicitação pendente</p>
                          )}
                        </div>
                      </div>
                      {relationshipStatus === 'none' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendFriendRequest(user.iduser)}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      )}
                      {relationshipStatus === 'friend' && (
                        <Button size="sm" variant="outline" disabled>
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                      {relationshipStatus === 'incoming' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const request = pendingRequests?.find((req: any) => 
                              req.requester?.iduser === user.iduser
                            );
                            if (request) {
                              acceptFriendRequest(request.id);
                            }
                          }}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Solicitações de Amizade</h2>
          {pendingRequests && pendingRequests.length > 0 ? (
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {pendingRequests.map((request: any) => (
                <Card key={request.id} className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {request.requester?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{request.requester?.name}</p>
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
                        onClick={() => declineFriendRequest(request.id)}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Você não tem solicitações de amizade pendentes.
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-3">
          Seus Amigos {friends && friends.length > 0 && `(${friends.length})`}
        </h2>
        {friendsLoading ? (
          <div className="text-center py-8">Carregando amigos...</div>
        ) : friends && friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {friends.map((friend: any) => (
              <Card key={friend.iduser} className="p-3">
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
                    <Dialog open={isAddToGroupOpen && selectedFriendForGroup?.iduser === friend.iduser} onOpenChange={(open) => {
                      setIsAddToGroupOpen(open);
                      if (!open) setSelectedFriendForGroup(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFriendForGroup(friend);
                            setIsAddToGroupOpen(true);
                          }}
                        >
                          <UserPlus2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar {friend.name} a um grupo</DialogTitle>
                          <DialogDescription>
                            Selecione um grupo para adicionar este amigo.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {groups && groups.length > 0 ? (
                            groups.map((group: any) => (
                              <Card key={group.id} className="p-3 cursor-pointer hover:bg-gray-50" 
                                    onClick={() => addFriendToGroup(friend.iduser, group.id)}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback>
                                      {group.name?.charAt(0) || "G"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">{group.name}</p>
                                    <p className="text-xs text-gray-500">{group.description}</p>
                                  </div>
                                </div>
                              </Card>
                            ))
                          ) : (
                            <p className="text-center text-gray-500 py-4">
                              Você não tem grupos criados ainda.
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFriend(friend.iduser)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Você ainda não tem amigos. Use a busca acima para encontrar e adicionar amigos!
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Seus Grupos</h2>
          </div>
          <CreateGroupDialog />
        </div>
        {groupsLoading ? (
          <div className="text-center py-8">Carregando grupos...</div>
        ) : groups && groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group: any) => (
              <MyGroupsCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Você ainda não entrou em nenhum grupo. Crie ou entre em um grupo para começar!
          </div>
        )}
      </Card>
    </div>
  );
};

export default Groups;