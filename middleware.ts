import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import useAxios from "@/app/api/AxiosInstance";

async function checkUserExtraInfo(id: number) {
  const { getCheckUserExtraInfo } = useAxios();

  try {
    const response = await getCheckUserExtraInfo(id);
    return response.data;
  } catch (error) {
    return false;
  }
}

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

  // If the token exists, add Google access token to headers if available
  const googleAccessToken = token?.googleAccessToken || null; // Assuming googleAccessToken is stored in the session

  // Add google access token to the request headers
  const headers = new Headers(req.headers);
  if (googleAccessToken) {
    headers.set("Authorization", `Bearer ${googleAccessToken}`);
  }

  // Proceed with the request, passing the updated headers
  const modifiedRequest = new NextRequest(req.url, {
    headers: headers,
    method: req.method,
    body: req.body,
    referrer: req.referrer,
    redirect: req.redirect,
  });

  // Check if user has all extra informations filled
  const userHasExtraInfo = await checkUserExtraInfo(token?.user?.iduser);

  if (!userHasExtraInfo) {
    const profileUrl = new URL("/profile", req.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next(modifiedRequest);
}

export const config = {
  matcher: ["/schedule/:path*", "/profile/:path*"], // Apply middleware to /schedule and its subpaths
};
