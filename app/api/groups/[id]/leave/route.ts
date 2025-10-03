import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    // const backendUrl =
    //   process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";
    const response = await fetchWithAuth(`/api/groups/${params.id}/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to leave group");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error leaving group:", error);
    return NextResponse.json(
      { error: "Failed to leave group" },
      { status: 500 }
    );
  }
}
