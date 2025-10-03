import { NextResponse } from "next/server";
import { cookies, headers as nextHeaders } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const returnTo = url.searchParams.get("returnTo") || "/";

  const cookieStore = await cookies();
  const refresh = cookieStore.get("refresh_token")?.value;

  if (!refresh) {
    const redir = NextResponse.redirect(new URL("/auth/signin", url.origin));
    redir.cookies.set("access_token", "", { maxAge: 0, path: "/" });
    redir.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
    redir.cookies.set("session", "", { maxAge: 0, path: "/" });
    redir.headers.set("Cache-Control", "no-store");
    return redir;
  }

  const hdrs = await nextHeaders();
  // const backend = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
  const resp = await fetch(`/api/auth/refresh`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Cookie: hdrs.get("cookie") || "",
    },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  if (!resp.ok) {
    const redir = NextResponse.redirect(new URL("/auth/signin", url.origin));
    redir.cookies.set("access_token", "", { maxAge: 0, path: "/" });
    redir.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
    redir.cookies.set("session", "", { maxAge: 0, path: "/" });
    redir.headers.set("Cache-Control", "no-store");
    return redir;
  }

  const { accessToken, refreshToken, accessTtlSec, refreshTtlSec, sessionJwt } = await resp.json();

  const back = NextResponse.redirect(new URL(returnTo, url.origin));
  back.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: accessTtlSec ?? 60 * 15,
  });
  if (refreshToken) {
    back.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: refreshTtlSec ?? 60 * 60 * 24 * 30,
    });
  }

  if (sessionJwt) {
    back.cookies.set("session", sessionJwt, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: accessTtlSec ?? 60 * 15,
    });
  }

  back.headers.set("Cache-Control", "no-store");
  return back;
}
