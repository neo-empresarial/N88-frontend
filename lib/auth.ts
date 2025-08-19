"use server";

import { redirect } from "next/navigation";
import { FormState, SignUpFormSchema, SignInFormSchema } from "./type";
import { createSession } from "./session";

// Esta é uma função do lado do servidor para lidar com chamadas de API.
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

// Esta é uma função do lado do servidor para lidar com chamadas de API.
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
  console.log('1. Server Action "signIn" iniciada.');

  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  
  console.log('2. Validação do formulário:', validatedFields.success);

  if (!validatedFields.success) {
    console.log('3. Falha na validação. Erros:', validatedFields.error.flatten().fieldErrors);
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log('4. Dados validados para a API:', validatedFields.data);
  
  const response = await login(validatedFields.data);

  console.log('5. Resposta da API recebida. Status:', response.statusCode);
  console.log('6. Corpo da resposta da API:', response);

  if (response.statusCode === 201) {
    console.log('7. Login bem-sucedido. Processando tokens.');

    const user = response.user

    // if (!accessToken) {
    //   console.error('8. Erro: Access token não encontrado na resposta.');
    //   return { message: "Access token não encontrado na resposta." };
    // }

    console.log('9. Criando sessão com os seguintes dados:', { user });
    await createSession({ user });

    console.log('10. Sessão criada. Redirecionando para /.');
    redirect("/");
  } else {
    console.log('11. Erro de login da API. Mensagem:', response.message);
    return {
      message:
        response.statusCode === 401
          ? "Email ou senha incorretos"
          : response.message || "Ocorreu um erro no servidor.",
    };
  }
}
//-------------------------------------------------------------
// A Server Action signUp, agora refatorada para usar a função de servidor `register`.
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

  // Usa a nova função de servidor `register`
  const response = await register(validationFields.data);

  if (response.statusCode === 201) {
    // Em caso de sucesso, redireciona para a página de login para que o usuário faça o acesso.
    return redirect("signin");
  }

  return {
    message:
      response.statusCode === 409
        ? "Esse email já está em uso. Tente outro."
        : response.message || "Ocorreu um erro no servidor.",
  };
}