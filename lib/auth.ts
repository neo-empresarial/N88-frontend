"use server";
import { SignUpFormSchema } from "./type";
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
  return { status, data: json.user };
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


async function register(data: data) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to register");
    }

    return responseData;
  } catch (error) {
      console.error("Falha na chamada da API de registro:", error);
    return {
      statusCode: 500,
      message: "Erro de rede. Verifique sua conexão.",
    };
  }
}

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
