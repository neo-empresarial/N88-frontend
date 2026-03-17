import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSavedSchedulesQuery } from "@/app/hooks/useSavedSchedules";
import { useSession } from "@/app/hooks/useSession";
import { useSubjects } from "../providers/subjectsContext";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SavedSchedule } from "@/app/services/savedSchedulesService";
import LoginSuggestionDialog from "./LoginSuggestionDialog";

export default function SaveScheduleDialog() {
  const { scheduleSubjects, currentScheduleId, scheduleTitle, clearLocalSchedule, resetToDefault, setCurrentScheduleId, setScheduleTitle, plansData, markAsSaved, calculateTotalCredits, getPlansDataForSave } = useSubjects();
  const { isAuthenticated } = useSession();
  const { updateScheduleAsync, createSchedule, deleteSchedule, savedSchedules, isCreating, isUpdating, isDeleting, isLoading } = useSavedSchedulesQuery(isAuthenticated);
  
  const isSaving = isCreating || isUpdating || isDeleting;

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const [showClearAlert, setShowClearAlert] = useState(false);
  
  const [title, setTitle] = useState(scheduleTitle);
  const [description, setDescription] = useState("");

  const TITLE_LIMIT = 45;
  const DESCRIPTION_LIMIT = 100;

  // Derive dirty state
  const currentSchedule = savedSchedules?.find(
    (s: SavedSchedule) => s.idsavedschedule === currentScheduleId
  );
  
  const isTitleDirty = currentSchedule ? currentSchedule.title !== scheduleTitle : false;
  
  const currentScheduleItems = currentSchedule 
    ? (currentSchedule.items && Array.isArray(currentSchedule.items) 
        ? currentSchedule.items 
        : currentSchedule.plans && Array.isArray(currentSchedule.plans)
          ? currentSchedule.plans.flatMap(p => p.items || [])
          : [])
    : [];

  const isSubjectsDirty = currentSchedule ? (
    scheduleSubjects.length !== currentScheduleItems.length ||
    scheduleSubjects.some(subj => {
      const savedItem = currentScheduleItems.find(i => i.subjectCode === subj.code && i.classCode === subj.class);
      return !savedItem || savedItem.activated !== subj.activated;
    })
  ) : false;
  
  const isDirty = currentScheduleId 
    ? (isLoading ? false : (!currentSchedule || isTitleDirty || isSubjectsDirty))
    : scheduleSubjects.length > 0;

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    if (currentScheduleId && currentSchedule) {
      try {
        await updateScheduleAsync({
          id: currentScheduleId,
          title: scheduleTitle,
          description: currentSchedule.description || '',
          plans: getPlansDataForSave(),
          totalCredits: calculateTotalCredits(),
        });
        markAsSaved();
      } catch (error) {
        console.error("Save failed:", error);
      }
    } else {
      // Save New
      setTitle(scheduleTitle);
      setDescription("");
      setShowSaveModal(true);
    }
  };

  const handleCreateNewClick = () => {
    if (isDirty) {
      setShowDiscardAlert(true);
    } else {
      clearLocalSchedule();
    }
  };

  const handleProceedDiscard = () => {
    setShowDiscardAlert(false);
    clearLocalSchedule();
  };

  const handleClearClick = () => {
    const hasScheduleToDelete = currentScheduleId && isAuthenticated;
    const hasLocalData = scheduleSubjects.length > 0;
    
    if (!hasScheduleToDelete && !hasLocalData) {
      toast.info("A grade já está vazia.");
      return;
    }
    setShowClearAlert(true);
  };

  const handleProceedClear = () => {
    setShowClearAlert(false);
    
    if (currentScheduleId && isAuthenticated) {
      deleteSchedule(currentScheduleId, {
        onSuccess: () => {
          resetToDefault();
          toast.success("Grade excluída da conta e dados locais limpos!");
        },
        onError: (error: Error) => {
          console.error("Error deleting schedule:", error);
          toast.error("Falha ao excluir da conta. Dados locais serão limpos.");
          resetToDefault();
        }
      });
    } else {
      resetToDefault();
      toast.success("Dados locais limpos com sucesso!");
    }
  };

  const handleConfirmSaveNew = () => {
    if (!title.trim()) {
      toast.error("Por favor, insira um título.");
      return;
    }
    createSchedule({
      title: title.trim(),
      description: description.trim(),
      plans: getPlansDataForSave(),
      totalCredits: calculateTotalCredits(),
    }, {
      onSuccess: (data: SavedSchedule) => {
        if (data && data.idsavedschedule) {
          setCurrentScheduleId(data.idsavedschedule);
          setScheduleTitle(data.title);
          markAsSaved();
        }
      }
    });
    setShowSaveModal(false);
  };

  // Auto-save event listener
  useEffect(() => {
    const handleAutoSave = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { plans: eventPlans, currentScheduleId: eventScheduleId, scheduleTitle: eventTitle } = customEvent.detail;
      
      if (!isAuthenticated || !eventScheduleId) return;
      
      const currentSchedule = savedSchedules?.find(
        (s: SavedSchedule) => s.idsavedschedule === eventScheduleId
      );
      
      if (currentSchedule) {
        try {
          await updateScheduleAsync({
            id: eventScheduleId,
            title: eventTitle,
            description: currentSchedule.description || '',
            plans: eventPlans,
            totalCredits: calculateTotalCredits(),
          });
          markAsSaved();
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
    };

    window.addEventListener('autoSaveSchedule', handleAutoSave);
    
    return () => {
      window.removeEventListener('autoSaveSchedule', handleAutoSave);
    };
  }, [isAuthenticated, savedSchedules, updateScheduleAsync, markAsSaved]);

  return (
    <div className="flex gap-0 space-x-2">
      <Button variant="outline" className="group relative overflow-hidden transition-all p-2 hover:px-3" onClick={handleSaveClick} disabled={isSaving}>
        <Save className="h-4 w-4 ml-2 shrink-0 transition-all duration-300 ease-in-out group-hover:ml-0" />
        <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[200px] group-hover:opacity-100 whitespace-nowrap">
          {isSaving ? "Salvando..." : "Salvar"}
        </span>
      </Button>
      
      <Button variant="outline" className="group relative overflow-hidden transition-all p-2 hover:px-3" onClick={handleCreateNewClick}>
        <Plus className="h-4 w-4 ml-2 shrink-0 transition-all duration-300 ease-in-out group-hover:ml-0" />
        <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[200px] group-hover:opacity-100 whitespace-nowrap">
          Nova grade
        </span>
      </Button>

      <Button 
        variant="destructive" 
        className="group relative overflow-hidden transition-all p-2 hover:px-3" 
        onClick={handleClearClick}
      >
        <Trash2 className="h-4 w-4 ml-2 shrink-0 transition-all duration-300 ease-in-out group-hover:ml-0" />
        <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[200px] group-hover:opacity-100 whitespace-nowrap">
          Excluir
        </span>
      </Button>

      <LoginSuggestionDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />

      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Salvar grade na conta</DialogTitle>
            <DialogDescription>
              Salve sua grade de horários atual para acessá-la de qualquer dispositivo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => e.target.value.length <= TITLE_LIMIT && setTitle(e.target.value)}
                placeholder="Insira o título da grade"
              />
              <p className="text-sm text-right text-muted-foreground">
                {title.length}/{TITLE_LIMIT}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => e.target.value.length <= DESCRIPTION_LIMIT && setDescription(e.target.value)}
                placeholder="Insira uma descrição (opcional)"
              />
              <p className="text-sm text-right text-muted-foreground">
                {description.length}/{DESCRIPTION_LIMIT}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConfirmSaveNew}
              disabled={!title.trim() || isCreating}
            >
              {isCreating ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDiscardAlert} onOpenChange={setShowDiscardAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterações não salvas</AlertDialogTitle>
            <AlertDialogDescription>
              Você possui alterações não salvas na sua grade atual. Se você criar uma nova grade agora, todas essas modificações serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceedDiscard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Prosseguir perdendo modificações
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearAlert} onOpenChange={setShowClearAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir grade</AlertDialogTitle>
            <AlertDialogDescription>
              {currentScheduleId && isAuthenticated ? (
                <>
                  Tem certeza que deseja excluir esta grade? Esta ação irá:
                  <br />
                  • Excluir permanentemente a grade da sua conta
                  <br />
                  • Limpar todos os dados locais (todos os 3 planos)
                  <br />
                  • Restaurar a página para o estado padrão com apenas o Plano 1
                  <br /><br />
                  Esta ação não pode ser desfeita.
                </>
              ) : (
                <>
                  Tem certeza que deseja limpar a grade? Esta ação irá:
                  <br />
                  • Limpar todos os dados locais (todos os 3 planos)
                  <br />
                  • Restaurar a página para o estado padrão com apenas o Plano 1
                  <br /><br />
                  As alterações não salvas serão perdidas.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceedClear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {currentScheduleId && isAuthenticated ? "Sim, excluir da conta" : "Sim, limpar dados"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
