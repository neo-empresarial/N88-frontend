import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest){
  // Check if we're in development environment
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const session = await getSession();

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/schedule", "/professors", "/profile"],
}