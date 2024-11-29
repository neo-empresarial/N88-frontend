// components/ProfileOptions.tsx

import { User, SunMoon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "./ui/label";
import Link from "next/link";
import Theme from "./Theme";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Session } from "next-auth";

import LogoutButton from "./logout-button";

export async function getSessionData(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  return session;
}

export default async function ProfileOptions() {
  const session = await getSessionData();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            {session ? (
              <Label className="mr-3">Olá, {session?.user?.name?.split(" ")[0]} 👋</Label>
            ) : (
              <></>
            )}

            {/* Avatar with responsive size */}
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={session?.user?.image ?? "/default-avatar.png"}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={"/profile"}
                className="flex items-center cursor-pointer w-full"
              >
                <User className="w-5" />
                <span className="ml-2">Perfil</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SunMoon />
                <Label className="ml-2">Mudar o tema</Label>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <Theme />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* Logout Button */}
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <LogoutButton /> 
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
