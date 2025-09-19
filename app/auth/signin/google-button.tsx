"use client";

import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createSession } from "@/lib/session";
import { url } from "node:inspector/promises";

export default function GoogleLoginButton(props: { style: string }) {

  const handleGoogleLogin = () => {
    window.location.href =
      (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/") +
      "auth/google/callback";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      user: {
        userId: Number(urlParams.get("userId")),
        name: urlParams.get("name") || "",
        email: urlParams.get("email") || "",
        provider: "google",
        accessToken: urlParams.get("accessToken") || "",
        refreshToken: urlParams.get("refreshToken") || "",
      },
    };
    console.log("Google login:", payload); // Debug log
    createSession(payload);
  }, []);

  return (
    <div className="w-1/2">
      <Button
        onClick={handleGoogleLogin}
        className={`bg-red-500 hover:bg-red-600 text-white + ${props.style}`}
      >
        <IconBrandGoogle className="h-5 w-5" />
        <span className="ml-2">Login com Google</span>
      </Button>
    </div>
  );
}
