import { deleteSession } from "./session";

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `/api/auth/refresh`,
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
  let response = await fetch(url, { ...options, credentials: "include" });

  if (response.status === 401) {
    try {
      await refreshAccessToken();
      response = await fetch(url, { ...options, credentials: "include" });
    } catch (err) {
      console.error("Erro ao renovar sessão:", err);
      throw err;
    }
  }

  return response;
}
