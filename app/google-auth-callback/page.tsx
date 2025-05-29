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

  const fetchData = async () => {
    await createSession({
      user: {
        id: id,
        name: name,
        email: email,
      },
    });
  };

  useEffect(() => {
    fetchData();
    router.push("/");
    router.refresh();
  }, []);

  return <div>Processing Google login...</div>;
}
