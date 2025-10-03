"use server";
import { SignUpFormSchema } from "./type";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { FormState, SignInFormSchema } from "./type";
import { SignJWT } from "jose";

type data = { email: string; password: string };

export async function signIn(state: FormState, formData: FormData): Promise<FormState> {
  const validated = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(validated.data),
  });

  const body = await res.json(); // { user, accessToken, refreshToken }
  if (res.ok && body?.user && body?.accessToken && body?.refreshToken) {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

    const payload = {
      user: {
        id: body.user.id,
        name: body.user.name,
        email: body.user.email,
        provider: body.user.provider,
      },
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
    };

    const maxAgeSec = 7 * 24 * 60 * 60;
    const session = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(maxAgeSec)
      .sign(secret);

    const jar = cookies();
    jar.set("session", session, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: maxAgeSec,
    });

    // (opcional) se quiser manter os cookies de tokens separados:
    jar.set("access_token", body.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: maxAgeSec,
    });
    jar.set("refresh_token", body.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: maxAgeSec,
    });

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
