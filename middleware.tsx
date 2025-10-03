// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/signin", "/auth/signup"];

function isIgnored(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public")
  );
}

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function mask(v?: string) {
  if (!v) return undefined;
  if (v.length <= 8) return "***";
  return v.slice(0, 4) + "…" + v.slice(-4);
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const access = req.cookies.get("access_token")?.value;
  const refresh = req.cookies.get("refresh_token")?.value;

  const decision = (() => {
    if (isIgnored(pathname) || isPublic(pathname)) return "next(public_or_ignored)";
    if (access) return "next(access_found)";
    if (refresh) return "redirect(refresh)";
    return "redirect(signin)";
  })();

  // 1) DEBUG QUICK VIEW (returns JSON if ?__debug=1)
  if (searchParams.has("__debug")) {
    const info = {
      now: new Date().toISOString(),
      path: pathname,
      search: req.nextUrl.search,
      matcherHit: ["/schedule/:path*", "/profile/:path*"].some((m) => pathname.startsWith(m.split(":")[0])),
      public: isPublic(pathname),
      ignored: isIgnored(pathname),
      cookiesSeen: {
        access_token: mask(access),
        refresh_token: mask(refresh),
      },
      headersSample: {
        host: req.headers.get("host"),
        referer: req.headers.get("referer"),
        userAgent: req.headers.get("user-agent"),
        xForwardedProto: req.headers.get("x-forwarded-proto"),
        xForwardedFor: req.headers.get("x-forwarded-for"),
      },
      decision,
      geo: req.geo ?? null,
      ip: req.ip ?? null,
    };
    return new NextResponse(JSON.stringify(info, null, 2), {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  // 2) NORMAL FLOW + DEBUG HEADERS (visíveis no Network tab)
  const resHeaders = new Headers();
  resHeaders.set("x-mw-decision", decision);
  resHeaders.set("x-mw-path", pathname);
  resHeaders.set("x-mw-public", String(isPublic(pathname)));
  resHeaders.set("x-mw-ignored", String(isIgnored(pathname)));
  resHeaders.set("x-mw-has-access", String(Boolean(access)));
  resHeaders.set("x-mw-has-refresh", String(Boolean(refresh)));

  if (decision === "next(public_or_ignored)" || decision === "next(access_found)") {
    return NextResponse.next({ headers: resHeaders });
  }

  if (decision === "redirect(refresh)") {
    const url = req.nextUrl.clone();
    url.pathname = "/api/auth/refresh";
    url.searchParams.set("returnTo", pathname + (req.nextUrl.search || ""));
    const res = NextResponse.redirect(url);
    // Mantém os headers de debug no redirect (útil em testes via curl)
    res.headers.set("x-mw-decision", decision);
    return res;
  }

  // redirect(signin)
  const signin = req.nextUrl.clone();
  signin.pathname = "/auth/signin";
  signin.searchParams.set("from", pathname + (req.nextUrl.search || ""));
  const res = NextResponse.redirect(signin);
  res.headers.set("x-mw-decision", decision);
  return res;
}

export const config = {
  matcher: ["/schedule/:path*", "/profile/:path*"],
};
