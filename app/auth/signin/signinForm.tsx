"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";
import { signIn } from "@/lib/auth";
import { useFormState } from "react-dom";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignInForm = () => {
  const [state, action] = useFormState(signIn, undefined);
  const [showPassword, setShowPassword]=useState(false);

  const togglePasswordVisibility = ()=> {
    setShowPassword(!showPassword)
  }
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
