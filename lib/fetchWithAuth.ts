import { deleteSession } from "./session";

let refreshPromise: Promise<void> | null = null;

async function getAccessToken(): Promise<string | null> {
  // Try to get token from cookie (for server-side)
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    return cookies().get("access_token")?.value || null;
  }

  // For client-side, we need to get it from the session API
  try {
    const response = await fetch("/api/session", {
      credentials: "include",
    });
    const data = await response.json();
    return data.session?.user?.accessToken || null;
  } catch {
    return null;
  }
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      } as RequestInit
    )
      .then(async (res: Response) => {
        if (!res.ok) {
          await deleteSession();
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get access token
  const token = await getAccessToken();

  // Set Authorization header if token is available
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (response.status === 401) {
    try {
      await refreshAccessToken();
      // Retry with new token
      const newToken = await getAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
      }
      response = await fetch(url, {
        ...options,
        credentials: "include",
        headers,
      });
    } catch (err) {
      console.error("Erro ao renovar sessão:", err);
      throw err;
    }
  }

  return response;
}
