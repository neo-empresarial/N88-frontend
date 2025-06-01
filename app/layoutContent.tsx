"use client";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {


  return <div className="flex-grow h-full">{children}</div>;
}
