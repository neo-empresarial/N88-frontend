// lib/create-session.ts (server-only)
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

type SessionPayload = {
  user: {
    userId: string;
    name: string;
    email: string;
    course?: string;
    provider: string;
  };
  accessToken: string;
  refreshToken: string;
};

type CookieOpts = {
  sameSite?: "lax" | "none";
  secure?: boolean;
  path?: string;
  maxAgeDays?: number;
  domain?: string; // normalmente DEIXE SEM em *.vercel.app
};

/** Cria o JWT de sessão e retorna um NextResponse com os cookies setados */
export async function createSessionResponse(
  payload: SessionPayload,
  opts: CookieOpts = {}
) {
  const {
    sameSite = "none",      // use "lax" quando tudo é same-site (recomendado com rewrite /api)
    secure = true,
    path = "/",
    maxAgeDays = 7,
    domain,
  } = opts;

  const maxAge = maxAgeDays * 24 * 60 * 60; // segundos

  const sessionJwt = await new SignJWT({
    user: payload.user,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
    .sign(encodedKey);

  const res = NextResponse.json({ ok: true });

  const common = { httpOnly: true, secure, sameSite, path, maxAge, domain } as const;

  res.cookies.set({ name: "session",       value: sessionJwt,           ...common });
  res.cookies.set({ name: "access_token",  value: payload.accessToken,  ...common });
  res.cookies.set({ name: "refresh_token", value: payload.refreshToken, ...common });

  return res;
}

/** Limpa todos os cookies de auth */
export function clearSessionResponse(opts: Pick<CookieOpts, "path" | "domain"> = {}) {
  const { path = "/", domain } = opts;
  const res = NextResponse.json({ ok: true });

  res.cookies.set({ name: "session",       value: "", path, domain, maxAge: 0 });
  res.cookies.set({ name: "access_token",  value: "", path, domain, maxAge: 0 });
  res.cookies.set({ name: "refresh_token", value: "", path, domain, maxAge: 0 });

  return res;
}
