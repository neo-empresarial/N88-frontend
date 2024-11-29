import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "./google-button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function SeparatorWithText(props: { text: string, style: string }) {
  return (
    <div className={`flex items-center space-x-4 ${props.style}`}>
      <Separator className="flex-1" />
      <span className="text-sm text-muted-foreground">{props.text}</span>
      <Separator className="flex-1" />
    </div>
  );
}

export default function Login() {
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="text-2xl">Olá 👋, acesse sua conta e monte suas grades!</CardTitle>
          <CardDescription>
            Escolha um dos métodos de Login disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-center">
            <GoogleLoginButton style="w-full cursor-pointer"/> 
          </div>
          <SeparatorWithText style="my-5" text="OU CONTINUE COM"/>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="exemplo@email.com" type="email"/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" />
              </div>
              <Button>Acessar com Email</Button>
              <div className="mt-2">
              <Label className="text-md">Não possui uma conta? 😱</Label><Badge className="w-fit ml-2 cursor-pointer text-sm">Crie uma aqui</Badge>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
