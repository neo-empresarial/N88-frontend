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
import { Copy, FileText } from "lucide-react";
import { useSubjects } from "../providers/subjectsContext";

export default function CopyPlanDialog() {
  const { 
    showCopyPlanDialog, 
    setShowCopyPlanDialog, 
    targetPlan,
    setTargetPlan,
    currentPlan,
    copyPlanData,
    markPlanAsInitialized,
  } = useSubjects();

  const handleCopyFromPlan = (sourcePlan: 1 | 2 | 3) => {
    if (targetPlan) {
      copyPlanData(sourcePlan, targetPlan);
      setShowCopyPlanDialog(false);
      setTargetPlan(null);
    }
  };

  const handleStartEmpty = () => {
    if (targetPlan) {
      setShowCopyPlanDialog(false);
      setTargetPlan(null);
      markPlanAsInitialized(targetPlan);
    }
  };

  const handleCancel = () => {
    setShowCopyPlanDialog(false);
    setTargetPlan(null);
  };

  if (!targetPlan) return null;

  const availablePlans = [1, 2, 3].filter(
    (p) => p !== targetPlan && p <= currentPlan
  ) as (1 | 2 | 3)[];

  return (
    <Dialog open={showCopyPlanDialog} onOpenChange={setShowCopyPlanDialog}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Configurar Plano {targetPlan}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Este é um plano novo. Você pode começar vazio ou copiar as matérias de outro plano.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {availablePlans.length > 0 && (
            <>
              <p className="text-sm font-medium text-muted-foreground">
                Copiar de:
              </p>
              <div className="space-y-2">
                {availablePlans.map((plan) => (
                  <Button
                    key={plan}
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-3"
                    onClick={() => handleCopyFromPlan(plan)}
                  >
                    <Copy className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Plano {plan}</div>
                      <div className="text-xs text-muted-foreground">
                        Copiar todas as matérias do Plano {plan}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou
                  </span>
                </div>
              </div>
            </>
          )}

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-auto py-3"
            onClick={handleStartEmpty}
          >
            <FileText className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Começar vazio</div>
              <div className="text-xs text-muted-foreground">
                Criar um plano sem nenhuma matéria
              </div>
            </div>
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
