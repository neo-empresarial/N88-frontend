"use server";

import { redirect } from "next/navigation";
import { FormState, SignUpFormSchema, SignInFormSchema } from "./type";
import { createSession } from "./session";

async function login(data: any): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Falha na chamada da API de login:", error);
    return {
      statusCode: 500,
      message: "Erro de rede. Verifique sua conexão.",
    };
  }
}

async function register(data: any): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
      console.error("Falha na chamada da API de registro:", error);
    return {
      statusCode: 500,
      message: "Erro de rede. Verifique sua conexão.",
    };
  }
}

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const response = await login(validatedFields.data);

  if (response.statusCode === 201) {
    const user = response.user
    await createSession({ user });
    redirect("/");
  } else {
    return {
      message:
        response.statusCode === 401
          ? "Email ou senha incorretos"
          : response.message || "Ocorreu um erro no servidor.",
    };
  }
}
//-------------------------------------------------------------
export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
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
  
  const response = await register(validationFields.data);

  if (response.statusCode === 201) {
    return redirect("signin");
  }

  return {
    message:
      response.statusCode === 409
        ? "Esse email já está em uso. Tente outro."
        : response.message || "Ocorreu um erro no servidor.",
  };
}