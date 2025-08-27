"use client";

import SubmitButton from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUp } from "@/lib/auth";
import { useFormState } from "react-dom";

const SignUpForm = () => {
  const [state, action] = useFormState(signUp, undefined);

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
          <Label htmlFor="course">Curso</Label>{" "}
          {/* Depois mudar pra um ComboBox */}
          <Input id="course" name="course" placeholder="Insira seu curso" />
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
          <Input id="password" name="password" type="password" placeholder="Insira uma senha"/>
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
