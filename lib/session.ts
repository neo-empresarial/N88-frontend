﻿"use server"

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: string | null;
    name: string | null;
  },
  // accessToken: string;
  // refreshToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
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
  })
}

export async function getSession() {
  const cookie = cookies().get("session")?.value;
  const token = cookies().get('token')?.value;

  if (!cookie) return null;

  if (token) {
    return { user: { id: token } } as Session;
  }

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (error) {
    console.error(error);
    // redirect("/auth/signin"); 
  }
}

export async function deleteSession(){
  await cookies().delete("session");
}