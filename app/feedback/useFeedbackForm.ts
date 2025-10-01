"use client";

import { z } from "zod";
import axios from "axios";

type FormState = {
  error?: {
    message?: string[];
  };
  message?: string;
  success?: boolean;
} | undefined;


const FeedbackFormSchema: z.ZodObject<{
  message: z.ZodString;
}> = z.object({
  message: z.string().min(10, { message: "Seu feedback deve ter no mínimo 10 caracteres" }).trim(),
});

export async function sendFeedback(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = FeedbackFormSchema.safeParse({
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/feedback`,
      parsed.data
    );

    if (res.status === 201) return { success: true };
    return { message: res.statusText || 'Erro ao enviar feedback' };
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      return { message: e.response?.data?.message ?? 'Falha ao enviar feedback' };
    }
    return { message: 'Falha ao enviar feedback' };
  }
}