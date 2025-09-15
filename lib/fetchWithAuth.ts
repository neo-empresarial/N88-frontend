let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Falha ao atualizar o access token");
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
