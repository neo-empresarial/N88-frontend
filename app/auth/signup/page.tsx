import { Label } from "@/components/ui/label";
import SignUpForm from "./signupForm";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-1/3 p-5">
        <Label className="text-2xl font-bold text-center">Crie sua conta</Label>

        <SignUpForm />

        <Label className="mt-2">
          Já possui uma conta?{" "}
          <Link href="/api/auth/signin" className="underline underline-offset-2">
            Entre aqui
          </Link>
        </Label>
      </Card>
    </div>
  );
}
