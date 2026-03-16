"use client";

import { useQuery } from "@tanstack/react-query";
import type { Session } from "@/lib/session";

async function fetchSession(): Promise<Session | null> {
  try {
    const response = await fetch("/api/session", { credentials: "include" });
    const data = await response.json();
    return data.session ?? null;
  } catch {
    return null;
  }
}

export function useSession() {
  const { data: session, isLoading } = useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    session: session ?? null,
    isAuthenticated: !!session,
    isLoading,
  };
}
