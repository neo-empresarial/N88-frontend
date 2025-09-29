import { NextRequest, NextResponse } from "next/server";
import { updateUserInSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { updatedUser } = await request.json();

    await updateUserInSession(updatedUser);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API - Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}