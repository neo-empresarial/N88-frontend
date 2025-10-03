import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.json({ ok: true });
  for (const name of ["session", "access_token", "refresh_token"]) {
    res.cookies.set({ name, value: "", path: "/", maxAge: 0 });
  }
  return res;
}
