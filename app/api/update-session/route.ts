import { NextRequest, NextResponse } from "next/server";
import { updateUserInSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    console.log("API - Starting session update");
    
    const { updatedUser } = await request.json();
    
    console.log("API - Received updated user:", {
      iduser: updatedUser.iduser,
      name: updatedUser.name,
      email: updatedUser.email,
      course: updatedUser.course
    });
    
    await updateUserInSession(updatedUser);
    
    console.log("API - Session updated successfully");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API - Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}