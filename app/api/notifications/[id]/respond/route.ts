import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accept } = body;

    if (typeof accept !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid accept parameter" },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_DATABASE_URL || "http://localhost:8000/";
    const response = await fetch(
      `${backendUrl}notifications/${params.id}/respond`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
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
