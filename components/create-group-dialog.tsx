"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "@geist-ui/icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface User {
  iduser: number;
  name: string;
  email: string;
}

const formSchema = z.object({
  name: z.string().min(3, "Nome do grupo deve ter pelo menos 3 caracteres"),
  description: z
    .string(),
});

type FormData = z.infer<typeof formSchema>;

const CreateGroupDialog = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {

      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}users`, { credentials: "include" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }
      return response.json();
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: FormData & { members: number[] }) => {
      const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL;

      const response = await fetchWithAuth(`${backendUrl}groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });



      if (!response.ok) {
        const error = await response.json();
        console.error("Erro da API:", error);
        throw new Error(error.message || "Failed to create group");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success(
        "Grupo criado com sucesso! Convites enviados para os membros selecionados."
      );
      setOpen(false);
      form.reset();
      setSelectedUsers([]);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Erro na mutation:", error);
      toast.error("Erro ao criar grupo");
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

  const onSubmit = async (data: FormData) => {
    if (selectedUsers.length === 0) {
      toast.error("Selecione pelo menos um usuário para convidar");
      return;
    }

    createGroupMutation.mutate({
      ...data,
      members: selectedUsers.map((user) => user.iduser),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 mb-4">
          <Plus className="w-4 h-4" />
          Criar grupo de estudos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar grupo de estudos</DialogTitle>
          <DialogDescription>
            Crie um grupo de estudos e convide seus amigos. Eles receberão um
            convite para aceitar ou recusar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do grupo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do grupo (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Convidar membros</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar por nome ou email"
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
                        <div className="px-4 py-2 text-gray-500">
                          Nenhum usuário encontrado
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Busque e convide membros para o grupo. Eles receberão um convite
                e poderão aceitar ou recusar.
              </FormDescription>
              <div className="mt-2 space-y-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.iduser}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-800"
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
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createGroupMutation.isPending}>
                {createGroupMutation.isPending ? "Criando..." : "Criar grupo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
