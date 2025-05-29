import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { ThemeProvider } from "@/components/theme-provider";
import { Infinity } from "@geist-ui/icons";
import Providers from "./providers";
import ProfileOptions from "@/app/profile/ProfileOptions";
import FeedbackButton from "./feedback/FeedbackButton";
import Theme from "@/components/Theme";
import { Toaster } from "@/components/ui/toaster";

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
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
          </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
