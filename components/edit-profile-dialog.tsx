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
import { Edit, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ICourse, MappedCourse } from "@/lib/type";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Session } from "@/lib/session";
import { useRouter } from "next/navigation";

interface EditProfileDialogProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => Promise<void>;
}

type oldDataType = {
  user: {
    userId: number;
    name: string;
    email: string;
    course: string;
  };
};



const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL;
};

const fetchCourses = async (): Promise<MappedCourse[]> => {
  try {
    const response = await fetch(`${getBackendUrl()}courses`);
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    const coursesData = (await response.json()) as ICourse[];
    return coursesData.map((course) => ({
      value: course.idcourse.toString(),
      label: course.course,
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

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
  const router = useRouter();
  const [courses, setCourses] = useState<MappedCourse[]>([]);
  const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [value, setValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      if (session?.user) {
        setFormData({
          name: session.user.name || "",
          email: session.user.email || "",
          course: session.user.course || "",
        });

        setCoursesLoading(true);
        const coursesData = await fetchCourses();
        setCourses(coursesData);

        if (session.user.course) {
          const currentCourse = coursesData.find(
            (course) => course.label === session.user.course
          );
          if (currentCourse) {
            setSelectedLabel(currentCourse.label);
            setValue(currentCourse.value);
          }
        }
        setCoursesLoading(false);
      }
    };

    initializeData();
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
    const userId = session?.user?.userId;
    if (!userId) throw new Error("User ID not found in session");

    const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/").replace(/\/?$/, "/");
    const url = `${API_BASE}users/${userId}`;

    const dataToSubmit = {
      ...formData,
      course: selectedLabel,
    };

    const response = await fetchWithAuth(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dataToSubmit),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update profile: ${response.status} - ${errorData}`);
    }

    const updatedUser = await response.json();

    if (onProfileUpdated) await onProfileUpdated();

    queryClient.setQueryData(["session"], (oldData: oldDataType) => ({
      ...oldData,
      user: {
        ...oldData?.user,
        userId: updatedUser.iduser,
        name: updatedUser.name,
        email: updatedUser.email,
        course: selectedLabel,
      },
    }));
    await queryClient.invalidateQueries({ queryKey: ["session"] });

    try {
      const sessionResponse = await fetch("/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedUser }),
      });
      if (!sessionResponse.ok) {
        toast.warning("Perfil atualizado, mas pode ser necessário recarregar a página para ver as mudanças.", {
          position: "bottom-right",
          autoClose: 4000,
        });
      }
    } catch {
      toast.warning("Perfil atualizado, mas pode ser necessário recarregar a página para ver as mudanças.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }

    toast.success("Perfil atualizado com sucesso!", { position: "bottom-right", autoClose: 2000 });
    onClose?.();
    await queryClient.invalidateQueries({ queryKey: ["session"] });
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    router.refresh();
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro ao atualizar perfil. Tente novamente.";
    toast.error(`Erro ao atualizar perfil: ${msg}`, { position: "bottom-right", autoClose: 2000 });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando
            terminar.
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
              <input
                type="hidden"
                name="course"
                id="course-input"
                value={selectedLabel || ""}
              />

              <Popover
                open={coursePopoverOpen}
                onOpenChange={setCoursePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={coursePopoverOpen}
                    className="w-full justify-between"
                    disabled={coursesLoading || isLoading}
                    type="button"
                  >
                    {coursesLoading
                      ? "Carregando cursos..."
                      : selectedLabel
                      ? selectedLabel
                      : "Selecione um curso..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0 z-[9999]">
                  <Command>
                    <CommandInput placeholder="Procurar curso..." />
                    <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
                    <CommandList className="max-h-60 overflow-y-auto">
                      <CommandGroup>
                        {courses.map((course) => (
                          <CommandItem
                            key={course.value}
                            value={course.label}
                            onSelect={() => {
                              setValue(course.value);
                              setSelectedLabel(course.label);
                              setFormData((prev) => ({
                                ...prev,
                                course: course.label,
                              }));
                              setCoursePopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === course.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {course.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
            <Button type="submit" disabled={isLoading || coursesLoading}>
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
