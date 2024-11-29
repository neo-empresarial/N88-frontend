"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export default function GoogleLoginButton(props: { style: string }) {
  return (
    <Button
      onClick={() => signIn("google")}
      className={`bg-red-500 hover:bg-red-600 text-white + ${props.style}`}
    >
      <IconBrandGoogle className="h-5 w-5" />
      <Label className="ml-2">Login com Google</Label>
    </Button>
  );
}
