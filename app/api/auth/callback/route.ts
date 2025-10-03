// app/api/auth/callback/route.ts
import { createSessionResponse } from "@/lib/create-session";

export async function POST(req: Request) {
  // Payload vindo do seu login: { user, accessToken, refreshToken }
  const body = await req.json();

  // Opcional: validar shape aqui

  // Se sua app é same-site (rewrite /api), mantenha sameSite:"lax"
  return createSessionResponse(
    {
      user: {
        userId: body.user.userId,
        name: body.user.name,
        email: body.user.email,
        course: body.user.course,
        provider: body.user.provider,
      },
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
    },
    { sameSite: "lax", secure: true, path: "/" }
  );
}
