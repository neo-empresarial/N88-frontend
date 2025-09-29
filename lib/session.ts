"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Session = {
  user: {
    accessToken: string;
    refreshToken: string;
    provider: string;
    userId: number;
    name: string;
    email: string;
    course: string;
  };
  
};

type UpdatedUser = {
  iduser?: number;
  name: string;
  email: string;
  course: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sessionPayload = {
    user: {
      userId: payload.user.userId,
      name: payload.user.name,
      email: payload.user.email,
      course: payload.user.course,
      provider: payload.user.provider,
    },
    accessToken: payload.user.accessToken,
    refreshToken: payload.user.refreshToken,
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

  cookies().set("access_token", sessionPayload.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiredAt,
    path: "/",
  });

  cookies().set("refresh_token", sessionPayload.refreshToken, {
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

    if (accessToken) {
      session.user.accessToken = accessToken;
    }
    return session;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function updateUserInSession(updatedUser: UpdatedUser) {
  const currentSession = await getSession();
  
  if (!currentSession) {
    throw new Error("No session found");
  }

  const newSession = {
    user: {
      accessToken: currentSession.user.accessToken,
      refreshToken: currentSession.user.refreshToken,
      provider: currentSession.user.provider,
      userId: updatedUser.iduser || currentSession.user.userId, 
      name: updatedUser.name,
      email: updatedUser.email,
      course: updatedUser.course,
    },
  };

  await createSession(newSession);
}

export async function deleteSession() {
  cookies().delete("session");
  cookies().delete("access_token");
  cookies().delete("refresh_token");
}