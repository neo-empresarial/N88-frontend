"use client";

import SubmitButton from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUp } from "@/lib/auth";
import { useState, useEffect, use } from "react";
import { useFormState } from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { redirect } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ICourse, MappedCourse } from "@/lib/type";

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL;
};

const fetchCourses = async (): Promise<MappedCourse[]> => {
  try {
    const response = await fetch(`${getBackendUrl()}courses`);
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    const coursesData = await response.json() as ICourse[];
    return coursesData.map(course => ({
      value: course.idcourse.toString(),
      label: course.course,
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

 const SignUpForm = () => {
  const [state, action] = useFormState(signUp, undefined);
  const [showPassword, setShowPassword] = useState(false);

  const [courses, setCourses] = useState([] as MappedCourse[]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      const coursesData: MappedCourse[] = await fetchCourses();
      setCourses(coursesData);
      setLoading(false);
    };
    getCourses();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form action={action}>
      <div className="flex flex-col gap-2">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" placeholder="Insira seu nome" />
          {state?.error?.name && (
            <p className="text-sm text-red-500">{state.error.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="course">Curso</Label>
          <input type="hidden" name="course" id="course-input" value={selectedLabel} />

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={loading}
              >
                {loading
                  ? "Carregando cursos..."
                  : value
                    ? courses.find((course) => course.value === value)?.label
                    : "Selecione um curso..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] p-0">
              <Command>
                <CommandInput placeholder="Procurar curso..." />
                <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
                <CommandList className="max-h-60 overflow-y-auto">
                  <CommandGroup>
                    {courses.map((course) => (
                      <CommandItem
                        key={course.value}
                        value={course.label}
                        onSelect={(currentLabel) => {
                          const selectedCourse = courses.find((c) => c.label === currentLabel);
                          if (selectedCourse){
                            setValue(selectedCourse.value);
                            setSelectedLabel(selectedCourse.label);
                          }
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === course.value ? "opacity-100" : "opacity-0"
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
          {state?.error?.course && (
            <p className="text-sm text-red-500">{state.error.course}</p>
          )}
        </div>

        <Separator className="mt-2 mb-2" />

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="Insira seu email" />
          {state?.error?.email && (
            <p className="text-sm text-red-500">{state.error.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Insira uma senha"
              className="pr-12"
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
          {state?.error?.password && (
            <p className="text-sm text-red-500">{state.error.password}</p>
          )}
        </div>
        <SubmitButton> Cadastrar-se </SubmitButton>
      </div>
    </form>
  );
};

export default SignUpForm;