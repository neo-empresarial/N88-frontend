import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSavedSchedulesQuery } from "@/app/hooks/useSavedSchedules";
import { Loader2, List, Trash2, Loader, Share2, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { SavedSchedule } from "@/app/services/savedSchedulesService";
import { useSubjects } from "../providers/subjectsContext";
import { toast } from "sonner";
import useAxios from "@/app/api/AxiosInstance";
import { SubjectsType } from "../types/dataType";
import { getUniqueColorPair, resetColorUsage } from "../utils/colorUtils";
import ShareScheduleDialog from "./ShareScheduleDialog";

export default function SavedSchedulesDialog() {
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [scheduleToShare, setScheduleToShare] = useState<SavedSchedule | null>(
    null
  );
  const [loadingScheduleId, setLoadingScheduleId] = useState<number | null>(
    null
  );
  const { savedSchedules, isLoading, deleteSchedule, isDeleting } =
    useSavedSchedulesQuery();
  const { setScheduleSubjects, setSearchedSubjects, setCurrentScheduleId } =
    useSubjects();
  const { getAllSubjectsWithRelations, getSubjectsByCodes } = useAxios();

  const handleDelete = (id: number) => {
    setSelectedSchedule(id);
    setShowDeleteAlert(true);
  };

  const handleShare = (schedule: SavedSchedule) => {
    setScheduleToShare(schedule);
    setShowShareDialog(true);
  };

  const confirmDelete = () => {
    if (selectedSchedule) {
      deleteSchedule(selectedSchedule);
      setShowDeleteAlert(false);
      setSelectedSchedule(null);
      setCurrentScheduleId(null);
    }
  };

  const handleLoadSchedule = async (schedule: SavedSchedule) => {
    if (loadingScheduleId === schedule.idsavedschedule) return;

    try {
      setLoadingScheduleId(schedule.idsavedschedule);
      resetColorUsage();
      setCurrentScheduleId(schedule.idsavedschedule);

      const subjectCodes = schedule.items.map((item) => item.subjectCode);

      const subjects = await getSubjectsByCodes(subjectCodes);

      if (!subjects || subjects.length === 0) {
        throw new Error("No subjects found for the schedule");
      }

      const scheduleItems = schedule.items.map((item) => ({
        code: item.subjectCode,
        class: item.classCode,
        activated: item.activated,
      }));

      const subjectsToLoad = subjects.map((subject: SubjectsType) => ({
        ...subject,
        color: getUniqueColorPair(),
      }));

      setSearchedSubjects(subjectsToLoad);
      setScheduleSubjects(scheduleItems);

      setOpen(false);
      toast.success("Grade carregada com sucesso");
    } catch (error) {
      console.error("Error loading schedule:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load schedule"
      );
      setCurrentScheduleId(null);
    } finally {
      setLoadingScheduleId(null);
    }
  };

  const getRandomColor = () => {
    const lightColors = [
      "bg-blue-200",
      "bg-green-200",
      "bg-yellow-200",
      "bg-red-200",
      "bg-purple-200",
      "bg-pink-200",
    ];
    const darkColors = [
      "bg-blue-800",
      "bg-green-800",
      "bg-yellow-800",
      "bg-red-800",
      "bg-purple-800",
      "bg-pink-800",
    ];

    const randomIndex = Math.floor(Math.random() * lightColors.length);
    return [lightColors[randomIndex], darkColors[randomIndex]];
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          console.log("Dialog open state changing to:", newOpen);
          setOpen(newOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <List className="h-4 w-4" />
            Grades salvas
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Grades salvas</DialogTitle>
            <DialogDescription>
              Vizualize e gerencie suas grades salvas
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : savedSchedules?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Não existem grades salvas
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Título</TableHead>
                    <TableHead className="w-[180px]">Descrição</TableHead>
                    <TableHead className="w-[50px]">Matérias</TableHead>
                    <TableHead className="w-[150px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedSchedules?.map((schedule: SavedSchedule) => (
                    <TableRow key={schedule.idsavedschedule}>
                      <TableCell className="line-clamp-2 break-words">
                          {schedule.title}
                      </TableCell>
                      <TableCell className="w-[180px]">
                        <div className="line-clamp-3 break-words">
                          {schedule.description}
                        </div>
                      </TableCell>
                      <TableCell>{schedule.items.length} matérias</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoadSchedule(schedule)}
                            disabled={loadingScheduleId === schedule.idsavedschedule || isDeleting}
                            className="h-8"
                          >
                            {loadingScheduleId === schedule.idsavedschedule ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            {loadingScheduleId === schedule.idsavedschedule ? "Carregando..." : "Baixar"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(schedule)}
                            disabled={isDeleting || loadingScheduleId === schedule.idsavedschedule}
                            className="h-8"
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Compartilhar
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(schedule.idsavedschedule)}
                            disabled={isDeleting || loadingScheduleId === schedule.idsavedschedule}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente a grade salva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {scheduleToShare && (
        <ShareScheduleDialog
          schedule={scheduleToShare}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}
    </>
  );
}
