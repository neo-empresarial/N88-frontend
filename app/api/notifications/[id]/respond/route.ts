import { NextResponse } from "next/server";
import { headers } from "next/headers";

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

    const body = await request.json();
    const { accept } = body;

    if (typeof accept !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid accept parameter" },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";
    const response = await fetch(
      `${backendUrl}notifications/${params.id}/respond`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accept }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to respond to invitation");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return NextResponse.json(
      { error: "Failed to respond to invitation" },
      { status: 500 }
    );
  }
}
