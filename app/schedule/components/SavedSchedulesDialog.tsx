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
import { Loader2, List, Trash2, Loader, Share2 } from "lucide-react";
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
    if (loadingScheduleId === schedule.idsavedschedule) return; // Prevent multiple simultaneous loads

    try {
      setLoadingScheduleId(schedule.idsavedschedule);

      // Reset color usage before loading new schedule
      resetColorUsage();

      // Set the current schedule ID
      setCurrentScheduleId(schedule.idsavedschedule);

      // Get only the subjects needed for this schedule
      const subjectCodes = schedule.items.map((item) => item.subjectCode);

      const subjects = await getSubjectsByCodes(subjectCodes);

      if (!subjects || subjects.length === 0) {
        throw new Error("No subjects found for the schedule");
      }

      // Prepare the data
      const scheduleItems = schedule.items.map((item) => ({
        code: item.subjectCode,
        class: item.classCode,
        activated: item.activated,
      }));

      const subjectsToLoad = subjects.map((subject: SubjectsType) => ({
        ...subject,
        color: getUniqueColorPair(),
      }));


      // Update the UI
      setSearchedSubjects(subjectsToLoad);
      setScheduleSubjects(scheduleItems);

      // Close dialog and show success
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
  // Helper function to get random colors for subjects
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
            Saved Schedules
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Saved Schedules</DialogTitle>
            <DialogDescription>
              View and manage your saved schedules
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : savedSchedules?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No saved schedules yet
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedSchedules?.map((schedule: SavedSchedule) => (
                    <TableRow key={schedule.idsavedschedule}>
                      <TableCell className="font-medium">
                        {schedule.title}
                      </TableCell>
                      <TableCell>{schedule.description}</TableCell>
                      <TableCell>{schedule.items.length} subjects</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoadSchedule(schedule)}
                            disabled={
                              loadingScheduleId === schedule.idsavedschedule ||
                              isDeleting
                            }
                            className="h-8"
                          >
                            {loadingScheduleId === schedule.idsavedschedule ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Loader className="h-4 w-4 mr-1" />
                            )}
                            {loadingScheduleId === schedule.idsavedschedule
                              ? "Loading..."
                              : "Load"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(schedule)}
                            disabled={
                              isDeleting ||
                              loadingScheduleId === schedule.idsavedschedule
                            }
                            className="h-8"
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDelete(schedule.idsavedschedule)
                            }
                            disabled={
                              isDeleting ||
                              loadingScheduleId === schedule.idsavedschedule
                            }
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              saved schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
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
