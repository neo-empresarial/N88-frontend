import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_DATABASE_URL || "http://localhost:8000/";

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${backendUrl}users/`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
