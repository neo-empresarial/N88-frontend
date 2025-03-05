import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { ThemeProvider } from "@/components/theme-provider";
import { Infinity } from '@geist-ui/icons'


import ProfileOptions from "@/app/profile/ProfileOptions";
import FeedbackButton from "./feedback/FeedbackButton";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "N88",
  description: "Created by KVZ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex flex-col h-full w-full">
            <Menubar className="flex justify-between items-center h-[10%]">
              <div className="flex space-x-4">
                <MenubarMenu>
                  <div className="text-sm lg:text-base flex gap-2 items-center ml-6">
                    <Infinity size={15} />
                    MatrUFSC 2.0
                  </div>
                  <MenubarTrigger className="flex transition-colors duration-400 hover:bg-gray-800 cursor-pointer">
                    <Link href={"/"}>Home</Link>
                  </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className="flex transition-colors duration-400 hover:bg-gray-800 cursor-pointer">
                    <Link href={"/schedule"}>Matérias</Link>
                  </MenubarTrigger>
                </MenubarMenu>
                {/* <MenubarMenu>
                  <MenubarTrigger className="flex transition-colors duration-400 hover:bg-gray-800 cursor-pointer">
                    <Link href={"/professors"}>Professores</Link>
                  </MenubarTrigger>
                </MenubarMenu> */}
              </div>
              <MenubarMenu>
                <MenubarTrigger className="ml-auto">
                  <ProfileOptions />
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>
            <div className="flex-grow h-full">{children}</div>
            <FeedbackButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
