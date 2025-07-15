import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";
    const response = await fetch(`${backendUrl}notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Backend error:", error);
      throw new Error(error.message || "Failed to fetch notifications");
    }

    const data = await response.json();
    console.log("Backend notifications response:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    const body = await request.json();
    const { recipientId, groupId } = body;

    if (!recipientId || !groupId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";
    const response = await fetch(`${backendUrl}notifications/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipientId, groupId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send invitation");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
