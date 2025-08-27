import { z } from "zod";

export type FormState = {
  error?: {
    name?: string[];
    course?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;

export const SignUpFormSchema: z.ZodObject<{
  name: z.ZodString;
  email: z.ZodString;
  password: z.ZodString;
}> = z.object({
  name: z.string().min(2, { message: "Esse nome está muito curto hein... Deve ter no mínimo 2 caracteres" }).trim(),
  course: z.string().trim(),
  email: z.string().email({ message: "Esse email não parece ser válido." }).trim(),
  password: z.string().min(6, { message: "Essa senha está muito curta hein... Ela deve ter no mínimo 6 caracteres!" }).trim(),
});

export const SignInFormSchema: z.ZodObject<{
  email: z.ZodString;
  password: z.ZodString;
}> = z.object({
  email: z.string().email({ message: "Esse email não parece ser válido" }).trim(),
  password: z.string().min(6, { message: "Essa senha está muito curta hein... Deve ter no mínimo 6 caracteres!" }).trim(),
});