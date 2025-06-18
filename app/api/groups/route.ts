import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    console.log("Session in groups route:", session);

    if (!session?.accessToken) {
      console.log("No access token found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, members } = body;

    if (!name || !description || !members || !Array.isArray(members)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        description,
        members,
        ownerId: session.user.id,
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
