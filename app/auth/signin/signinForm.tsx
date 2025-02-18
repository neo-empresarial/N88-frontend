"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submitButton";
import { signIn } from "@/lib/auth";
import { useFormState } from "react-dom";

const SignInForm = () => {
  const [state, action] = useFormState(signIn, undefined);

  return (
    <form action={action}>
      <div className="grid w-full items-center  gap-4">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            id="email"
            placeholder="exemplo@email.com"
            type="email"
          />
          {state?.error?.email && (
            <p className="text-sm text-red-500">{state.error.email}</p>
          )}
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input name="password" id="password" type="password" />
          {state?.error?.password && (
            <p className="text-sm text-red-500">{state.error.password}</p>
          )}
        </div>

        <div className="w-full flex justify-center">
          <div className="w-1/2">
            <SubmitButton>Acessar com Email</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
