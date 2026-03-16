"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LoginSuggestionDialog({ open, onOpenChange }: Props) {
  const router = useRouter();

  const handleGoToLogin = () => {
    onOpenChange(false);
    router.push("/auth/signin");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Entre para continuar
          </DialogTitle>
          <DialogDescription>
            Para salvar, carregar e compartilhar grades você precisa ter uma
            conta. É rápido e gratuito!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:flex-row flex-col">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Agora não
          </Button>
          <Button onClick={handleGoToLogin} className="gap-2">
            <LogIn className="h-4 w-4" />
            Vamos lá!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
