import { useState } from "react";
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
import { Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { SavedSchedule } from "@/app/services/savedSchedulesService";
import LoginSuggestionDialog from "./LoginSuggestionDialog";

export default function SaveScheduleDialog() {
  const { scheduleSubjects, currentScheduleId, scheduleTitle, clearLocalSchedule, setCurrentScheduleId, setScheduleTitle } = useSubjects();
  const { isAuthenticated } = useSession();
  const { updateSchedule, createSchedule, savedSchedules, isCreating, isUpdating, isLoading } = useSavedSchedulesQuery(isAuthenticated);
  
  const isSaving = isCreating || isUpdating;

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  
  const [title, setTitle] = useState(scheduleTitle);
  const [description, setDescription] = useState("");

  const TITLE_LIMIT = 45;
  const DESCRIPTION_LIMIT = 100;

  // Derive dirty state
  const currentSchedule = savedSchedules?.find(
    (s: SavedSchedule) => s.idsavedschedule === currentScheduleId
  );
  const isTitleDirty = currentSchedule ? currentSchedule.title !== scheduleTitle : false;
  const isSubjectsDirty = currentSchedule ? (
    scheduleSubjects.length !== currentSchedule.items.length ||
    scheduleSubjects.some(subj => {
      const savedItem = currentSchedule.items.find(i => i.subjectCode === subj.code && i.classCode === subj.class);
      return !savedItem || savedItem.activated !== subj.activated;
    })
  ) : false;
  
  const isDirty = currentScheduleId 
    ? (isLoading ? false : (!currentSchedule || isTitleDirty || isSubjectsDirty))
    : scheduleSubjects.length > 0;

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    if (scheduleSubjects.length === 0) {
      toast.info("A grade está vazia.");
      return;
    }

    if (currentScheduleId && currentSchedule) {
      // Quick Save existing
      updateSchedule({
        id: currentScheduleId,
        title: scheduleTitle,
        description: currentSchedule.description || '',
        scheduleSubjects: scheduleSubjects,
      });
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

  const handleConfirmSaveNew = () => {
    if (!title.trim()) {
      toast.error("Por favor, insira um título.");
      return;
    }
    createSchedule({
      title: title.trim(),
      description: description.trim(),
      scheduleSubjects,
    }, {
      onSuccess: (data: any) => {
        if (data && data.idsavedschedule) {
          setCurrentScheduleId(data.idsavedschedule);
          setScheduleTitle(data.title);
        }
      }
    });
    setShowSaveModal(false);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="gap-2" onClick={handleSaveClick} disabled={isSaving}>
        <Save className="h-4 w-4" />
        {isSaving ? "Salvando..." : "Salvar"}
      </Button>
      
      <Button variant="outline" className="gap-2" onClick={handleCreateNewClick}>
        <Plus className="h-4 w-4" />
        Nova grade
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
    </div>
  );
}
