// lib/auth.ts
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { FormState, SignInFormSchema } from "./type";

type data = { email: string; password: string };

async function login(data: data) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const status = response.status;
  const json = await response.json(); // espere { user, accessToken, refreshToken }
  return { status, data: json };
}

export async function signIn(state: FormState, formData: FormData): Promise<FormState> {
  const validated = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  const res = await login(validated.data);
  if (res.status === 200 || res.status === 201) {
    const { accessToken, refreshToken } = res.data ?? {};
    if (!accessToken || !refreshToken) return { message: "Resposta sem tokens." };

    const jar = cookies();
    const maxAge = 7 * 24 * 60 * 60;
    const common = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge };
    jar.set("access_token", accessToken, common);
    jar.set("refresh_token", refreshToken, common);

    redirect("/");
  }

  return { message: res.status === 401 ? "Email ou senha incorretos" : "Erro ao autenticar." };
}
