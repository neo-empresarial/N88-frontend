import { getSession } from "./session";

export async function getGroup(groupId: number) {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8000/groups/${groupId}`, {
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
