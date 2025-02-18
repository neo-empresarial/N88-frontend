import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Session } from "next-auth";

export async function getSessionData(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  
  return session ?? null;
}
