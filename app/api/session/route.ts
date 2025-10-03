import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SESSION_KEY = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

export async function GET() {
  const jar = cookies();
  const sessionJwt = jar.get("session")?.value;
  const access = jar.get("access_token")?.value;

  // Nenhum cookie? 401
  if (!sessionJwt && !access) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // 1) Tente decodificar o session JWT localmente (rápido)
  if (sessionJwt) {
    try {
      const { payload } = await jwtVerify(sessionJwt, SESSION_KEY);
      // payload.user esperado do seu createSession
      type SessionPayload = { user: unknown }; // Adjust 'unknown' to your actual user type if available
      return NextResponse.json({ ok: true, user: (payload as SessionPayload).user });
    } catch {}
  }

  // 2) (Opcional) Sem session ou inválido? Consulte o backend /me usando o access_token
  if (access) {
    try {
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/me`, {
        headers: { Authorization: `Bearer ${access}` },
        // server->backend: não precisa credentials: "include"
        cache: "no-store",
      });
      if (meRes.ok) {
        const user = await meRes.json();
        return NextResponse.json({ ok: true, user });
      }
    } catch {}
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
