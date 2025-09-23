import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    const body = await request.json();
    const { name, description, members } = body;

    if (!name || !description || !members || !Array.isArray(members)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetchWithAuth(`${backendUrl}groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        description,
        members,
        ownerId: 0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Backend error response:", error);
      throw new Error(error.message || "Failed to create group");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
