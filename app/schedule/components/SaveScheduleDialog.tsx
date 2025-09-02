import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSavedSchedulesQuery } from "@/app/hooks/useSavedSchedules";
import { useSubjects } from "../providers/subjectsContext";
import { Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { SavedSchedule } from "@/app/services/savedSchedulesService";
import { useSavedSchedules } from "@/app/services/savedSchedulesService";

function QuickSaveButton() {
  const { scheduleSubjects, currentScheduleId } = useSubjects();
  const { updateSchedule, savedSchedules, isCreating } =
    useSavedSchedulesQuery();

  const handleQuickSave = () => {
    if (!currentScheduleId) {
      toast.info("Nenhum grade atualmente carregada.");
      return;
    }

    const existingSchedule = savedSchedules?.find(
      (schedule: SavedSchedule) =>
        schedule.idsavedschedule === currentScheduleId
    );

    if (existingSchedule) {
      console.log("Atualizando grade existente:", existingSchedule.title);
      updateSchedule({
        id: existingSchedule.idsavedschedule,
        title: existingSchedule.title,
        description: existingSchedule.description || '',
        scheduleSubjects: scheduleSubjects,
      });
    } else {
      toast.error("Não foi possível encontrar a grade atual.");
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={handleQuickSave}
      disabled={isCreating || !currentScheduleId}
    >
      <Save className="h-4 w-4" />
      {isCreating ? "Salvando..." : "Salvar"}
    </Button>
  );
}

function CreateScheduleDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { scheduleSubjects } = useSubjects();
  const { createSchedule, savedSchedules, isCreating } =
    useSavedSchedulesQuery();

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Por favor, insira um título para a grade.");
      return;
    }

    if (scheduleSubjects.length === 0) {
      toast.error("Por favor, insira ao menos uma matéria à grade.");
      return;
    }

    createSchedule({
      title: title.trim(),
      description: description.trim(),
      scheduleSubjects,
    });

    setTitle("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova grade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crie uma nova grade</DialogTitle>
          <DialogDescription>
            Crie uma nova grade de horários com um título e descrição diferentes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Insira o título da grade"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              maxLength={100}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Insira uma descrição (opcional)"
            />
            
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? "Salvando..." : "Criar grade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function SaveScheduleDialog() {
  return (
    <div className="flex gap-2">
      <QuickSaveButton />
      <CreateScheduleDialog />
    </div>
  );
}
