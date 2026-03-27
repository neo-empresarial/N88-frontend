import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useSavedSchedulesQuery } from "@/app/hooks/useSavedSchedules";
import { useSession } from "@/app/hooks/useSession";
import LoginSuggestionDialog from "./LoginSuggestionDialog";
import { Loader2, List, Trash2, Share2, Download, MessageSquare } from "lucide-react";
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
import { useCompetitionService } from "@/app/services/competitionService";

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
  const [modalJustOpened, setModalJustOpened] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [scheduleToLoad, setScheduleToLoad] = useState<SavedSchedule | null>(null);
  const { isAuthenticated } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { savedSchedules, isLoading, deleteSchedule, isDeleting } =
    useSavedSchedulesQuery(isAuthenticated);
  const { currentScheduleId, setCurrentScheduleId, loadFullSchedule, setSelectedSemesterDirectly, setSelectedCampusDirectly, localSaveStatus } =
    useSubjects();
  const { getSubjectsByCodes } = useAxios();
  const { getBatchCompetitionScores } = useCompetitionService();

  const formatSemesterDisplay = (semester: string | undefined) => {
    if (!semester) return "-";
    return semester.replace(/\//g, '.');
  };

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
      if (selectedSchedule === currentScheduleId) {
        setCurrentScheduleId(null);
      }
    }
  };

  const confirmLoadWithUnsavedChanges = () => {
    if (scheduleToLoad) {
      setShowUnsavedChangesAlert(false);
      handleLoadScheduleDirectly(scheduleToLoad);
      setScheduleToLoad(null);
    }
  };

  const cancelLoadWithUnsavedChanges = () => {
    setShowUnsavedChangesAlert(false);
    setScheduleToLoad(null);
  };

  const getAllItems = (schedule: SavedSchedule) => {
    if (schedule.items && Array.isArray(schedule.items)) {
      return schedule.items;
    }
    if (schedule.plans && Array.isArray(schedule.plans)) {
      return schedule.plans.flatMap(plan => plan.items || []);
    }
    return [];
  };

  const getCreditsPerPlan = (schedule: SavedSchedule) => {
    const credits = { plan1: 0, plan2: 0, plan3: 0 };
    
    if (schedule.plans && Array.isArray(schedule.plans)) {
      schedule.plans.forEach(plan => {
        const planKey = `plan${plan.planNumber}` as keyof typeof credits;
        credits[planKey] = plan.credits || 0;
      });
    } else if (schedule.items && Array.isArray(schedule.items)) {
      // Legacy format - sum credits from all activated items in plan 1
      credits.plan1 = schedule.items
        .filter(item => item.activated)
        .reduce((sum, item) => sum + (item.credits || 0), 0);
    }
    
    return credits;
  };

  const checkUnsavedChanges = (schedule: SavedSchedule) => {
    if (localSaveStatus === "modified") {
      setScheduleToLoad(schedule);
      setShowUnsavedChangesAlert(true);
      return;
    }
    handleLoadScheduleDirectly(schedule);
  };

  const handleLoadScheduleDirectly = async (schedule: SavedSchedule) => {
    if (loadingScheduleId === schedule.idsavedschedule) return;

    try {
      setLoadingScheduleId(schedule.idsavedschedule);

      resetColorUsage();

      const allItems = getAllItems(schedule);
      console.log("All items to load:", allItems);
      const subjectCodes = allItems.map((item) => item.subjectCode);

      // Fetch subjects and competition scores in parallel
      const [subjects, competitionResult] = await Promise.allSettled([
        getSubjectsByCodes(subjectCodes, schedule.campus ? String(schedule.campus) : undefined),
        getBatchCompetitionScores(subjectCodes)
      ]);

      // Handle subjects data (required)
      if (subjects.status === 'rejected') {
        throw new Error("Failed to fetch subjects data");
      }

      if (!subjects.value || subjects.value.length === 0 && allItems.length > 0) {
        throw new Error("No subjects found for the schedule");
      }

      // Handle competition scores (optional)
      const competitionMap = new Map();
      if (competitionResult.status === 'fulfilled') {
        competitionResult.value.scores.forEach(score => {
          competitionMap.set(score.code, score);
        });
      } else {
        console.warn("Failed to fetch competition scores:", competitionResult.reason);
      }

      const getSubjectsForPlan = (items: typeof allItems) => {
        return items.map((item) => ({
          code: item.subjectCode,
          class: item.classCode,
          activated: item.activated,
        }));
      };

      const getSearchedSubjectsForPlan = (items: typeof allItems) => {
        const planSubjectCodes = items.map((i) => String(i.subjectCode));
        let filteredSubjects = subjects.value
          .filter((s: SubjectsType) => planSubjectCodes.includes(s.code));
        
        // Filter by saved semester if available
        if (schedule.semester) {
          filteredSubjects = filteredSubjects.filter((s: SubjectsType) => 
            s.semester?.semester === schedule.semester
          );
        }
        
        return filteredSubjects.map((subject: SubjectsType) => {
          const competition = competitionMap.get(subject.code);
          return {
            ...subject,
            color: getUniqueColorPair(),
            competition: competition || undefined,
          };
        });
      };

      const createEmptyPlan = () => ({
        scheduleSubjects: [],
        searchedSubjects: [],
        selectedSubject: {} as SubjectsType,
        onFocusSubject: { code: "" },
        onFocusSubjectClass: { code: "", classcode: "" },
      });

      const newPlansData: Record<1|2|3, any> = {
        1: createEmptyPlan(),
        2: createEmptyPlan(),
        3: createEmptyPlan(),
      };

      const initializedPlans: (1|2|3)[] = [1];

      if (schedule.plans && schedule.plans.length > 0) {
        schedule.plans.forEach(plan => {
          const planNum = plan.planNumber as 1|2|3;
          if (!initializedPlans.includes(planNum)) {
            initializedPlans.push(planNum);
          }
          const items = plan.items || [];
          newPlansData[planNum].scheduleSubjects = getSubjectsForPlan(items);
          newPlansData[planNum].searchedSubjects = getSearchedSubjectsForPlan(items);
        });
      } else if (schedule.items && schedule.items.length > 0) {
        // Fallback for legacy format (all in plan 1)
        newPlansData[1].scheduleSubjects = getSubjectsForPlan(schedule.items);
        newPlansData[1].searchedSubjects = getSearchedSubjectsForPlan(schedule.items);
      }

      loadFullSchedule({
        plansData: newPlansData,
        title: schedule.title,
        id: schedule.idsavedschedule,
        initializedPlans,
      });

      // Set the semester from saved schedule
      if (schedule.semester) {
        setSelectedSemesterDirectly(schedule.semester);
      }

      // Set the campus from saved schedule
      if (schedule.campus) {
        setSelectedCampusDirectly(String(schedule.campus));
      }

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

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          if (newOpen && !isAuthenticated) {
            setShowLoginDialog(true);
            return;
          }
          setOpen(newOpen);
          
          if (newOpen) {
            setModalJustOpened(true);
            setTimeout(() => setModalJustOpened(false), 300);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="group relative overflow-hidden transition-all p-2 hover:px-3">
            <List className="h-4 w-4 ml-2 shrink-0 transition-all duration-300 ease-in-out group-hover:ml-0" />
            <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[200px] group-hover:opacity-100 whitespace-nowrap">
              Grades salvas
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1100px]">
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
                      <TableHead className="w-[110px]">Comentários</TableHead>
                      <TableHead className="flex-1">Título</TableHead>
                      <TableHead className="w-[90px] text-center">Semestre</TableHead>
                      <TableHead className="w-[100px] text-center">Plano 1</TableHead>
                      <TableHead className="w-[100px] text-center">Plano 2</TableHead>
                      <TableHead className="w-[100px] text-center">Plano 3</TableHead>
                      <TableHead className="w-[140px] text-right">Ações</TableHead>
                   </TableRow>
                 </TableHeader>
                <TableBody>
                  {(Array.isArray(savedSchedules) ? savedSchedules : []).map((schedule) => {
                    const credits = getCreditsPerPlan(schedule);
                    return (
                      <TableRow key={schedule.idsavedschedule}>
                         <TableCell className="w-[110px]">
                           <HoverCard 
                             openDelay={100} 
                             closeDelay={100}
                             open={modalJustOpened ? false : undefined}
                           >
                             <HoverCardTrigger asChild>
                               <Button variant="ghost" size="sm" className="p-1 h-auto">
                                 <MessageSquare className="h-4 w-4 text-muted-foreground" />
                               </Button>
                             </HoverCardTrigger>
                             <HoverCardContent className="w-80">
                               <div className="space-y-2">
                                 <p className="text-sm break-words">
                                   {schedule.description || "Nenhum comentário"}
                                 </p>
                               </div>
                             </HoverCardContent>
                           </HoverCard>
                        </TableCell>
                         <TableCell className="flex-1 min-w-0">
                           <div className="line-clamp-2 break-words">
                             {schedule.title}
                           </div>
                         </TableCell>
                         <TableCell className="w-[90px] text-center">
                           {formatSemesterDisplay(schedule.semester)}
                         </TableCell>
                          <TableCell className="w-[100px] text-center">
                            {credits.plan1 > 0 ? `${credits.plan1} créditos` : "-"}
                          </TableCell>
                         <TableCell className="w-[100px] text-center">
                           {credits.plan2 > 0 ? `${credits.plan2} créditos` : "-"}
                         </TableCell>
                         <TableCell className="w-[100px] text-center">
                           {credits.plan3 > 0 ? `${credits.plan3} créditos` : "-"}
                         </TableCell>
                        <TableCell className="w-[140px]">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => checkUnsavedChanges(schedule)}
                              disabled={loadingScheduleId === schedule.idsavedschedule || isDeleting}
                              className="h-8 w-8"
                            >
                              {loadingScheduleId === schedule.idsavedschedule ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleShare(schedule)}
                              disabled={isDeleting || loadingScheduleId === schedule.idsavedschedule}
                              className="h-8 w-8"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(schedule.idsavedschedule)}
                              disabled={isDeleting || loadingScheduleId === schedule.idsavedschedule}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

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
                  onClick={(e) => {
                    e.preventDefault();
                    confirmDelete();
                  }}
                  className="bg-destructive text-destructive-foreground"
                >
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={showUnsavedChangesAlert} onOpenChange={setShowUnsavedChangesAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mudanças não salvas</AlertDialogTitle>
                <AlertDialogDescription>
                  Você tem mudanças não salvas na grade atual. Se continuar, estas mudanças serão perdidas.
                  Deseja prosseguir mesmo assim?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={cancelLoadWithUnsavedChanges}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmLoadWithUnsavedChanges}
                  className="bg-destructive text-destructive-foreground"
                >
                  Prosseguir
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
        </DialogContent>
      </Dialog>

      <LoginSuggestionDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </>
  );
}
