"use client";
import { useState } from "react";
import { Loader2, Plus,Trash} from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./ui/dialog";
import { useQuery, useQueryClient, useMutation,} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { DialogTrigger } from "@radix-ui/react-dialog";

const DeleteGroupDialog = ({ groupId }: { groupId: number }) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { mutate: deleteGroup, isPending } = useMutation({
        mutationFn: async () => {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/${groupId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete group");
            }
        },
        onSuccess: () => {
            toast.success("Grupo deletado com sucesso");
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            router.push("/groups");
        },
        onError: (error) => {
            toast.error("Falha ao deletar o grupo");
            console.error(error);
        },
    });

    const handleDeleteGroup = () => {
        deleteGroup();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Trash className="w-2 h-2" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Você tem certeza?</DialogTitle>
                    <DialogDescription>
                        <br />
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleDeleteGroup} disabled={isPending}>
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4" />
                                Apagando...
                            </div>
                        ) : (
                            "Deletar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteGroupDialog;