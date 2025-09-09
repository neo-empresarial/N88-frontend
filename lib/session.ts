"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Session = {
  user: {
    id: number;
    name: string;
    email: string;
    course: string;
  };
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sessionPayload = {
    user: {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      course: payload.user.course,
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

    if (accessToken) {
      session.accessToken = accessToken;
    }

    return session;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function updateUserInSession(updatedUser: any) {
  console.log("Session - Updating user in session:", updatedUser);
  
  const currentSession = await getSession();
  
  if (!currentSession) {
    throw new Error("No session found");
  }

  console.log("Session - Current session:", currentSession);

  const newSession = {
    ...currentSession,
    user: {
      id: updatedUser.iduser,
      name: updatedUser.name,
      email: updatedUser.email,
      course: updatedUser.course,
    },
  };

  console.log("Session - New session:", newSession);

  await createSession(newSession);
}

export async function deleteSession() {
  cookies().delete("session");
  cookies().delete("access_token");
}