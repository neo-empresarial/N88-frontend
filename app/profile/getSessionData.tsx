import { getServerSession } from "next-auth/next";

import { Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

export async function getSessionData(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  
  return session ?? null;
}
