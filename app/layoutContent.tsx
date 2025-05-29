'use client';

import Link from "next/link";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Infinity } from "@geist-ui/icons";
import { useQuery } from '@tanstack/react-query';
import ProfileOptions from "@/app/profile/ProfileOptions";
import FeedbackButton from "./feedback/FeedbackButton";
import Theme from "@/components/Theme";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  // Now this useQuery is properly inside the QueryClient provider
  const { data, isLoading, error } = useQuery({
    queryKey: ['yourData'],
    queryFn: () => fetch('/api/your-endpoint').then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
  });

  // You might want to handle loading/error states differently
  // For layout, you probably don't want to block everything
  if (isLoading) {
    // Consider showing a loading indicator instead of blocking
    console.log('Loading layout data...');
  }
  
  if (error) {
    console.error('Layout data error:', error);
  }

  return (
    <div className="flex flex-col h-full w-full">
      <Menubar className="flex justify-between items-center h-[10%]">
        <div className="flex space-x-4">
          <MenubarMenu>
            <Link href={"/"}>
              <div className="text-sm lg:text-base flex gap-2 items-center ml-6">
                <Infinity size={15} />
                MatrUFSC 2.0
              </div>
            </Link>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="flex transition-colors duration-400 hover:bg-gray-800 cursor-pointer">
              <Link href={"/schedule"}>Matérias</Link>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="flex transition-colors duration-400 hover:bg-gray-800 cursor-pointer">
              <Link href={"/professors"}>Professores</Link>
            </MenubarTrigger>
          </MenubarMenu>
        </div>
        <div className="flex gap-2">
          <MenubarMenu>
            <Theme />
            <MenubarTrigger className="ml-auto">
              <ProfileOptions />
            </MenubarTrigger>
          </MenubarMenu>
        </div>
      </Menubar>
      <div className="flex-grow h-full">{children}</div>
      <FeedbackButton />
    </div>
  );
}