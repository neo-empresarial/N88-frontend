"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  console.log(`payload: ${payload.user}`)
  // Ensure the payload matches the expected structure
  const sessionPayload = {
    user: {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
    },
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  };

  const session = await new SignJWT(sessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiredAt)
    .sign(encodedKey);

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiredAt,
    path: "/",
  });

  cookies().set("access_token", payload.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiredAt,
    path: "/",
  });
}

export async function getSession() {
  const cookie = cookies().get("session")?.value;
  const accessToken = cookies().get("access_token")?.value;

  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    const session = payload as Session;

    // Ensure we have the latest access token
    if (accessToken) {
      session.accessToken = accessToken;
    }

    return session;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function deleteSession() {
  cookies().delete("session");
  cookies().delete("access_token");
}
