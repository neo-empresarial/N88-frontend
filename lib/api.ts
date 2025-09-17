import { fetchWithAuth } from "./fetchWithAuth";

export async function getGroup(groupId: number) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";

  const response = await fetchWithAuth(`${backendUrl}groups/${groupId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch group");
  }

  return response.json();
}
