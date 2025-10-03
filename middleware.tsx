// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/signin", "/auth/signup"];

function isIgnored(p: string) {
  return p.startsWith("/_next")
    || p === "/favicon.ico" || p === "/robots.txt" || p === "/sitemap.xml"
    || p.startsWith("/images") || p.startsWith("/public");
}
function isPublic(p: string) {
  return PUBLIC_PATHS.some((base) => p === base || p.startsWith(base + "/"));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isIgnored(pathname) || isPublic(pathname)) return NextResponse.next();

  const access = req.cookies.get("access_token")?.value;
  const refresh = req.cookies.get("refresh_token")?.value;

  if (access) return NextResponse.next({
    headers: {
      "x-mw-has-access": "true",
      "x-mw-has-refresh": String(!!refresh),
    }
  });

  if (refresh) {
    const url = req.nextUrl.clone();
    url.pathname = "/api/auth/refresh";
    url.searchParams.set("returnTo", pathname + (req.nextUrl.search || ""));
    const res = NextResponse.redirect(url);
    res.headers.set("x-mw-decision", "redirect(refresh)");
    return res;
  }

  const signin = req.nextUrl.clone();
  signin.pathname = "/auth/signin";
  signin.searchParams.set("from", pathname + (req.nextUrl.search || ""));
  const res = NextResponse.redirect(signin);
  res.headers.set("x-mw-decision", "redirect(signin)");
  return res;
}

export const config = { matcher: ["/schedule/:path*", "/profile/:path*"] };
