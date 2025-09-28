import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import LogoutButton from "@/components/logout-button";
import { getSession } from "@/lib/session";

import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Users } from "@geist-ui/icons";

export default async function ProfileOptions() {
  const session = await getSession();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            {session ? (
              <Label className="mr-3">
                Olá, {session?.user?.name?.split(" ")[0]} 👋
              </Label>
            ) : (
              <></>
            )}

            <Avatar className="w-8 h-8">
              <AvatarImage
                src={"/default-avatar.png"}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {!session?.user ? (
            <>
              <DropdownMenuItem>
                <Button className="w-full">
                  <Link
                    href={"/auth/signin"}
                    className="flex items-center justify-center cursor-pointer w-full"
                  >
                    <LogIn className="w-5" />
                    <span className="ml-2 text-md">Entrar</span>
                  </Link>
                </Button>
              </DropdownMenuItem>
            </>
          ) : (
            <>
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

                <DropdownMenuItem>
                  <Link
                    href={"/groups"}
                    className="flex items-center cursor-pointer w-full"
                  >
                    <Users className="w-5" />
                    <span className="ml-2">Grupos</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
