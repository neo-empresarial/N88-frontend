"use client";
import { useEffect } from "react";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { createSession } from "@/lib/session";

export default function GoogleAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  const fetchData = async () => {
    if (!id || !name || !email || !accessToken || !refreshToken) {
      console.error("Missing required parameters for Google auth callback");
      router.push("/auth/login");
      return;
    }

    // Store in localStorage for API calls
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify({
      id: parseInt(id, 10),
      name: name,
      email: email,
    }));

    // Create session for ProfileOptions and other server components
    await createSession({
      user: {
        id: parseInt(id, 10),
        name: name,
        email: email,
      },
      accessToken,
      refreshToken,
    });
  };

  useEffect(() => {
    fetchData();
    router.push("/");
    router.refresh();
  }, []);

  return <div>Processing Google login...</div>;
}
