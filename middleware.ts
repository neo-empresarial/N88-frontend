import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Extract the session token from the request
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If the token is invalid or missing, redirect to login
  if (!token) {
    const loginUrl = new URL("/api/auth/signin", req.url); // Redirect to the NextAuth signin page
    loginUrl.searchParams.set("callbackUrl", req.url); // Store the original URL for post-login redirection
    return NextResponse.redirect(loginUrl);
  }

  // If the token exists, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/schedule/:path*","/profile/:path*"], // Apply middleware to /schedule and its subpaths
};
