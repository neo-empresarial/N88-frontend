// lib/auth-cookies.ts (server-only)
import { NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

type Tokens = { accessToken: string; refreshToken: string; session?: string };
type Options = Partial<Pick<ResponseCookie, "sameSite"|"secure"|"path"|"domain">> & { maxAgeDays?: number };

export function setAuthCookies(res: NextResponse, tokens: Tokens, opts: Options = {}) {
  const {
    sameSite = "none",         // "none" p/ same-site
    secure = true,
    path = "/",
    domain,
    maxAgeDays = 7,
  } = opts;

  const maxAge = maxAgeDays * 24 * 60 * 60; // seg
  const common = { httpOnly: true, secure, sameSite, path, domain, maxAge } as const;

  if (tokens.session) {
    res.cookies.set({ name: "session", value: tokens.session, ...common });
  }
  res.cookies.set({ name: "access_token",  value: tokens.accessToken,  ...common });
  res.cookies.set({ name: "refresh_token", value: tokens.refreshToken, ...common });

  return res;
}

export function clearAuthCookies(res: NextResponse, opts: Options = {}) {
  const { path = "/", domain } = opts;
  const common = { path, domain, maxAge: 0 } as const;

  res.cookies.set({ name: "session", value: "", ...common });
  res.cookies.set({ name: "access_token", value: "", ...common });
  res.cookies.set({ name: "refresh_token", value: "", ...common });
  return res;
}
