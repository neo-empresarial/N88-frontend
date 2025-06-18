import { getSession } from "./session";

export async function getGroup(groupId: number) {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("No access token found");
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_DATABASE_URL || "http://localhost:8000/";
  const response = await fetch(`${backendUrl}groups/${groupId}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch group");
  }

  return response.json();
}
