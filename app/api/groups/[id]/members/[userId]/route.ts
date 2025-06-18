import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getSession();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_DATABASE_URL || "http://localhost:8000/";
    const response = await fetch(
      `${backendUrl}groups/${params.id}/members/${params.userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove member from group");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error removing member from group:", error);
    return NextResponse.json(
      { error: "Failed to remove member from group" },
      { status: 500 }
    );
  }
}
