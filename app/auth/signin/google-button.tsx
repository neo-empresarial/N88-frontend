"use client";

import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";

export default function GoogleLoginButton(props: { style: string }) {
  const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") || "/"; // Retrieve the callbackUrl query parameter

  return (
    <div className="w-1/2">
      <Button
        // onClick={() => signIn("google", { callbackUrl })}
        className={`bg-red-500 hover:bg-red-600 text-white + ${props.style}`}
      >
        <IconBrandGoogle className="h-5 w-5" />
        <span className="ml-2">Login com Google</span>
      </Button> 
    </div>
  );
}
