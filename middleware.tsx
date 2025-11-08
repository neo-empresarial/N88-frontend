import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export default async function middleware(req: NextRequest) {
  // Check if we're in development environment
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // Read cookies from the request (middleware can't use cookies() from next/headers)
  const sessionCookie = req.cookies.get("session")?.value;
  const accessTokenCookie = req.cookies.get("access_token")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  try {
    // Verify the session JWT
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });

    // Check if session has user data
    const session = payload as any;
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
    }

    // Session is valid, allow request
    return NextResponse.next();
  } catch (error) {
    // Session verification failed, redirect to login
    console.error("Middleware session verification error:", error);
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }
}

export const config = {
  matcher: ["/schedule", "/professors", "/profile"],
};
