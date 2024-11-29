// app/profile/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div>{children}</div>
    </SessionProvider>
  );
}
