import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/auth/signin",
  "/auth/signup",
];

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

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isIgnored(pathname) || isPublic(pathname)) {
    return NextResponse.next();
  }

  const access = req.cookies.get("access_token")?.value;
  const refresh = req.cookies.get("refresh_token")?.value;

  if (access) return NextResponse.next();

  if (refresh) {
    const url = req.nextUrl.clone();
    url.pathname = "/api/auth/refresh";
    url.searchParams.set("returnTo", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  // Sem nenhum token → login
  const signin = req.nextUrl.clone();
  signin.pathname = "/auth/signin";
  signin.searchParams.set("from", pathname + (search || ""));
  return NextResponse.redirect(signin);
}

export const config = {
  matcher: [
    "/schedule/:path*",
    "/profile/:path*",
  ],
};
