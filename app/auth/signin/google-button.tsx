"use client";

import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createSession } from "@/lib/session";

export default function GoogleLoginButton(props: { style: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoogleLogin = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL;
    window.location.href = `${backendUrl}auth/google/login`;
  };

  useEffect(() => {
    const userId = searchParams.get("userId");
    const name = searchParams.get("name") || "";
    const email = searchParams.get("email") || "";
    const provider = searchParams.get("provider") || "google"; // Default para "google"
    const accessToken = searchParams.get("accessToken") || "";
    const refreshToken = searchParams.get("refreshToken") || "";

    if (
      userId &&
      name &&
      email &&
      accessToken &&
      refreshToken &&
      !isProcessing
    ) {
      setIsProcessing(true);
      const course = searchParams.get("course") || "";
      const payload = {
        user: {
          userId: Number(userId),
          name,
          email,
          provider,
          accessToken,
          refreshToken,
          course, // Add course to the user object
        },
      };

      createSession(payload)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.error("Erro ao criar sessão:", error);
          router.push("/login?error=auth_failed");
        });
    }
  }, [searchParams, isProcessing, router]);

  return (
    <div className="w-1/2">
      <Button
        onClick={handleGoogleLogin}
        className={`bg-red-500 hover:bg-red-600 text-white ${props.style ? ' ' + props.style : ''}`}
        disabled={isProcessing}
      >
        <IconBrandGoogle className="h-5 w-5" />
        <span className="ml-2">Login com Google</span>
      </Button>
    </div>
  );
}
