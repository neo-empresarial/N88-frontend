"use client";

import { redirect } from "next/navigation";
import { FormState, SignUpFormSchema, SignInFormSchema } from "./type";
import useAxios from "@/app/api/AxiosInstance";
import { createSession } from "./session";
import { useEffect } from "react";

export async function signUp(state: FormState, formData: FormData): Promise<FormState> {
  const { register } = useAxios();

  const validationFields = SignUpFormSchema.safeParse({
    name: formData.get("name"),
    course: formData.get("course"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await register(validationFields.data) as Response;

  if (response.status === 201) {
    return redirect("/auth/signin");
  }

  return {
    message:
      response.status === 409 ?
        "Esse email já está em uso. Tente outro."
        : response.statusText,
  }
}

export async function signIn(state: FormState, formData: FormData): Promise<FormState> {
  const { login } = useAxios();

  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await login(validatedFields.data) as any;

  if (response.status === 201) {
    const responseData = await response.data
    console.log(responseData)
    await createSession({
      user: {
        id: responseData.id,
        name: responseData.name,
      }
    })
    
    redirect("/");
  }

  return {
    message: 
      response.status === 401 ? "Email ou senha incorretos" : response.statusText,
  }
}