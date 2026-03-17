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
import { useRouter, usePathname } from "next/navigation";
import { LogIn } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LoginSuggestionDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleGoToLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectAfterLogin", pathname);
    }
    onOpenChange(false);
    router.push("/auth/signin");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="space-y-4 pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            <LogIn className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Entre para continuar
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed">
            Para salvar, carregar e compartilhar grades você precisa ter uma
            conta. É rápido e gratuito!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:flex-row flex-col pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Agora não
          </Button>
          <Button 
            onClick={handleGoToLogin} 
            className="gap-2 flex-1"
          >
            <LogIn className="h-4 w-4" />
            Vamos lá!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
