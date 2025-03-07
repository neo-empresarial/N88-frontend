﻿"use client";

import { z } from "zod";

import useAxios from "../api/AxiosInstance";

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

export async function sendFeedback(state: FormState, formData: FormData): Promise<FormState> {
  const { registerFeedback } = useAxios();

  const validationFields = FeedbackFormSchema.safeParse({
    message: formData.get("message"),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await registerFeedback(validationFields.data) as Response;

  if (response.status === 201) return {
    success: true,
  };

  return {
    message: response.statusText,
  }
}