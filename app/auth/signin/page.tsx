import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "./google-button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import SignInForm from "./signinForm";

function SeparatorWithText(props: { text: string; style: string }) {
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
          <CardTitle className="text-2xl">
            Olá 👋, acesse sua conta e monte suas grades!
          </CardTitle>
          <CardDescription>
            Escolha um dos métodos de Login disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-center">
            <GoogleLoginButton style="w-full cursor-pointer" />
          </div>
          {/* <SeparatorWithText style="my-5" text="OU CONTINUE COM" /> */}

          {/* <SignInForm /> */}

          {/* <div className="mt-2">
            <Label className="text-md">Não possui uma conta? 😱 </Label>
            <Link href="/auth/signup" className="underline underline-offset-2">
              Crie uma aqui
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
