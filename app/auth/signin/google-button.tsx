"use client";

import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GoogleLoginButton(props: { style: string }) {
  const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") || "/"; // Retrieve the callbackUrl query parameter

  const handleGoogleLogin = () => {
    window.location.href =
      (process.env.NEXT_PUBLIC_DATABASE_URL || "http://localhost:8000/") +
      "auth/google/login";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = process.env.NEXT_PUBLIC_FRONTEND_URL!;
    }
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
