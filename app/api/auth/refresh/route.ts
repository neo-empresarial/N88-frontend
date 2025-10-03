// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Leia o refresh dos cookies automaticamente enviados
  // Valide com o Nest e gere newAccess
  const newAccess = "NOVO_ACCESS_TOKEN";

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "access_token",
    value: newAccess,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
