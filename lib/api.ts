export async function getGroup(groupId: number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) {
    throw new Error("No access token found");
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";
  const response = await fetch(`${backendUrl}groups/${groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch group");
  }

  return response.json();
}
