"use server";
import { SignUpFormSchema } from "./type";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { FormState, SignInFormSchema } from "./type";
import { SignJWT } from "jose";

// função de logger simples
function logEvent(event: string, details?: unknown) {
  console.log(`[AUTH] ${event}`, details ?? "");
}

type data = { email: string; password: string };

export async function signIn(state: FormState, formData: FormData): Promise<FormState> {
  const validated = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    logEvent("❌ Validação falhou no login", validated.error.flatten().fieldErrors);
    return { error: validated.error.flatten().fieldErrors };
  }

  logEvent("✅ Validação de login bem-sucedida", { email: validated.data.email });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(validated.data),
  });

  const body = await res.json();

  if (res.ok && body?.user && body?.user.accessToken && body?.user.refreshToken) {
    logEvent("🔐 Login bem-sucedido", { user: body.user.email });

    const secret = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

    const payload = {
      user: {
        id: body.user.id,
        name: body.user.name,
        email: body.user.email,
        provider: body.user.provider,
      },
      accessToken: body.user.accessToken,
      refreshToken: body.user.refreshToken,
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

    jar.set("access_token", body.user.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: maxAgeSec,
    });
    jar.set("refresh_token", body.user.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: maxAgeSec,
    });

    redirect("/");
  }

  logEvent("⚠️ Falha no login", { status: res.status, body });
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
      console.error("[REGISTER] ❌ Falha no registro:", responseData.message);
      throw new Error(responseData.message || "Failed to register");
    }

    console.log("[REGISTER] ✅ Registro bem-sucedido:", responseData.email);
    return responseData;
  } catch (error) {
    console.error("[REGISTER] 🚨 Erro de rede:", error);
    return {
      statusCode: 500,
      message: "Erro de rede. Verifique sua conexão.",
    };
  }
}

export async function signUp(state: FormState, formData: FormData): Promise<FormState> {
  const validationFields = SignUpFormSchema.safeParse({
    name: formData.get("name"),
    course: formData.get("course"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationFields.success) {
    console.warn("[SIGNUP] ❌ Validação falhou", validationFields.error.flatten().fieldErrors);
    return { error: validationFields.error.flatten().fieldErrors };
  }

  console.log("[SIGNUP] ✅ Validação bem-sucedida", { email: validationFields.data.email });

  const response = await register(validationFields.data);

  if (response.statusCode === 201) {
    console.log("[SIGNUP] 🎉 Usuário registrado, redirecionando para signin");
    return redirect("signin");
  }

  console.error("[SIGNUP] ⚠️ Erro no servidor ou email duplicado", response);
  return {
    message:
      response.statusCode === 409
        ? "Esse email já está em uso. Tente outro."
        : response.message || "Ocorreu um erro no servidor.",
  };
}
