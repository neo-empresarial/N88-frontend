"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';


interface EditProfileDialogProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => Promise<void>; 
}

export default function EditProfileDialog({
  session,
  isOpen,
  onClose,
  onProfileUpdated, 
}: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        course: session.user.course || "",
      });
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isLoading) return;
    
    setIsLoading(true);
  
    try {
      const token = session?.accessToken;
      
      if (!token) {
        throw new Error("No access token found");
      }
  
      const userId = session?.user?.iduser || session?.user?.id;
      
      if (!userId) {
        throw new Error("User ID not found in session");
      }
  
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"}users/${userId}`;
  
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update profile: ${response.status} - ${errorData}`);
      }
  
      const updatedUser = await response.json();
      console.log("Updated user from backend:", updatedUser);
  
      try {
        const sessionResponse = await fetch("/api/update-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updatedUser }),
        });
  
        const sessionResult = await sessionResponse.json();
        console.log("Session update response:", sessionResult);
  
        if (!sessionResponse.ok) {
          console.error("Session update failed:", sessionResult);
          toast.warning("Perfil atualizado, mas pode ser necessário recarregar a página para ver as mudanças.", {
            position: "bottom-right",
            autoClose: 4000,
          });
        }
      } catch (sessionError) {
        console.error("Session update error:", sessionError);
        toast.warning("Perfil atualizado, mas pode ser necessário recarregar a página para ver as mudanças.", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
  
      if (onProfileUpdated) {
        await onProfileUpdated();
      }
      
      queryClient.setQueryData(["session"], (oldData: any) => ({
        ...oldData,
        user: {
          ...oldData?.user,
          id: updatedUser.iduser,
          name: updatedUser.name,
          email: updatedUser.email,
          course: updatedUser.course,
        },
      }));
  
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      
      console.log("Profile updated successfully");
      toast.success("Perfil atualizado com sucesso!",{
        position: "bottom-right",
        autoClose: 2000,
      });
      onClose();
      
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error instanceof Error) {
        toast.error(`Erro ao atualizar perfil: ${error.message}`, {
          position: "bottom-right",
          autoClose: 2000,
        });
        
      } else {
        toast.error("Erro ao atualizar perfil. Tente novamente.", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gray-500 dark:bg-gray-700 text-xl">
                  {formData.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                disabled
                title="Profile picture will be available soon"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                placeholder="Seu curso"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}