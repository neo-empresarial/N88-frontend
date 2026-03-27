"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SelectedSubject from "./components/SelectedSubject";
import SubjectsTable from "./components/SubjectsTable";
import WeekCalendarComponent from "./components/WeekCalendar";
import SearchSubject from "./components/SearchSubject";
import SemesterSelector from "./components/SemesterSelector";
import SemesterChangeModal from "./components/SemesterChangeModal";
import CampusSelector from "./components/CampusSelector";
import CampusChangeModal from "./components/CampusChangeModal";
import SaveScheduleDialog from "./components/SaveScheduleDialog";
import SavedSchedulesDialog from "./components/SavedSchedulesDialog";
import ReceivedSharedSchedulesDialog from "./components/ReceivedSharedSchedulesDialog";
import CopyPlanDialog from "./components/CopyPlanDialog";
import { SubjectsType } from "./types/dataType";

import { useEffect, useState } from "react";
import useAxios from "@/app/api/AxiosInstance";
import { SubjectsProvider, useSubjects } from "./providers/subjectsContext";
import { Loader2, Cloud, CloudOff, AlertCircle, Edit2, Check, X, Eraser, Calculator, Zap, FileText } from "lucide-react";
import { useUnsavedChangesWarning } from "@/app/hooks/useUnsavedChangesWarning";
import { useSavedSchedulesQuery } from "@/app/hooks/useSavedSchedules";
import { useSession } from "@/app/hooks/useSession";
import { SavedSchedule } from "@/app/services/savedSchedulesService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function AccountSaveStatusBadge() {
  const { currentScheduleId, scheduleTitle, localSaveStatus, plansData } = useSubjects();
  const { isAuthenticated } = useSession();
  const { savedSchedules, isCreating, isUpdating, isLoading } = useSavedSchedulesQuery(isAuthenticated);

  if (isLoading || isCreating || isUpdating) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        {isLoading ? "Verificando status..." : "Salvando na conta..."}
      </div>
    );
  }

  if (localSaveStatus === "saving") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Salvando localmente...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
        <CloudOff className="h-3 w-3" />
        Não salvo na conta
      </div>
    );
  }

  if (!currentScheduleId) {
    if (localSaveStatus === "idle") {
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
          <FileText className="h-3 w-3" />
          Grade local
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 mt-1">
        <AlertCircle className="h-3 w-3" />
        Não salvo na conta
      </div>
    );
  }

  const currentSchedule = savedSchedules?.find(
    (s: SavedSchedule) => s.idsavedschedule === currentScheduleId
  );

  if (!currentSchedule) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 mt-1">
        <AlertCircle className="h-3 w-3" />
        Grade não encontrada
      </div>
    );
  }

  const isTitleDirty = currentSchedule.title !== scheduleTitle;
  
  // Compare all plans data with saved data
  let isDataDirty = false;
  
  if (currentSchedule.plans && Array.isArray(currentSchedule.plans)) {
    // New format with plans
      const savedPlansByNumber: Record<number, { subjectCode: string; classCode: string; activated: boolean; }[]> = {};
    currentSchedule.plans.forEach(plan => {
      savedPlansByNumber[plan.planNumber] = plan.items || [];
    });
    
    // Check each plan
    for (let planNum = 1; planNum <= 3; planNum++) {
      const currentPlanData = plansData[planNum as 1 | 2 | 3]?.scheduleSubjects || [];
      const savedPlanItems = savedPlansByNumber[planNum] || [];
      
      if (currentPlanData.length !== savedPlanItems.length) {
        isDataDirty = true;
        break;
      }
      
      const hasSubjectChanges = currentPlanData.some(subj => {
        const savedItem = savedPlanItems.find(i => i.subjectCode === subj.code && i.classCode === subj.class);
        return !savedItem || savedItem.activated !== subj.activated;
      });
      
      if (hasSubjectChanges) {
        isDataDirty = true;
        break;
      }
    }
  } else if (currentSchedule.items && Array.isArray(currentSchedule.items)) {
    // Legacy format - compare only plan 1
    const plan1Data = plansData[1]?.scheduleSubjects || [];
    const savedItems = currentSchedule.items;
    
    isDataDirty = plan1Data.length !== savedItems.length ||
      plan1Data.some(subj => {
        const savedItem = savedItems.find(i => i.subjectCode === subj.code && i.classCode === subj.class);
        return !savedItem || savedItem.activated !== subj.activated;
      });
  }

  if (isTitleDirty || isDataDirty) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 mt-1">
        <AlertCircle className="h-3 w-3" />
        Alterações não salvas
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-green-500 dark:text-green-400 mt-1">
      <Cloud className="h-3 w-3" />
      Salvo na conta
    </div>
  );
}

function ScheduleTitle() {
  const { scheduleTitle, setScheduleTitle } = useSubjects();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(scheduleTitle);

  useEffect(() => {
    setTempTitle(scheduleTitle);
  }, [scheduleTitle]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input 
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          className="text-2xl font-bold h-10 w-64 px-2"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setScheduleTitle(tempTitle || "Grade sem título");
              setIsEditing(false);
            } else if (e.key === "Escape") {
              setTempTitle(scheduleTitle);
              setIsEditing(false);
            }
          }}
        />
        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={() => {
          setScheduleTitle(tempTitle || "Grade sem título");
          setIsEditing(false);
        }}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => {
          setTempTitle(scheduleTitle);
          setIsEditing(false);
        }}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 min-h-[40px]">
      <h1 className="text-3xl font-bold">{scheduleTitle}</h1>
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-8 w-8"
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

function ScheduleHeader() {
  const { currentScheduleId, scheduleTitle, plansData } = useSubjects();
  const { isAuthenticated } = useSession();
  const { savedSchedules, isLoading } = useSavedSchedulesQuery(isAuthenticated);

  const currentSchedule = savedSchedules?.find(
    (s: SavedSchedule) => s.idsavedschedule === currentScheduleId
  );
  
  const isTitleDirty = currentSchedule ? currentSchedule.title !== scheduleTitle : false;
  
  // Compare all plans data with saved data (same logic as AccountSaveStatusBadge)
  let isSubjectsDirty = false;
  
  if (currentSchedule) {
    if (currentSchedule.plans && Array.isArray(currentSchedule.plans)) {
      // New format with plans
    const savedPlansByNumber: Record<number, { subjectCode: string; classCode: string; activated: boolean; }[]> = {};
      currentSchedule.plans.forEach(plan => {
        savedPlansByNumber[plan.planNumber] = plan.items || [];
      });
      
      // Check each plan
      for (let planNum = 1; planNum <= 3; planNum++) {
        const currentPlanData = plansData[planNum as 1 | 2 | 3]?.scheduleSubjects || [];
        const savedPlanItems = savedPlansByNumber[planNum] || [];
        
        if (currentPlanData.length !== savedPlanItems.length) {
          isSubjectsDirty = true;
          break;
        }
        
        const hasSubjectChanges = currentPlanData.some(subj => {
          const savedItem = savedPlanItems.find(i => i.subjectCode === subj.code && i.classCode === subj.class);
          return !savedItem || savedItem.activated !== subj.activated;
        });
        
        if (hasSubjectChanges) {
          isSubjectsDirty = true;
          break;
        }
      }
    } else if (currentSchedule.items && Array.isArray(currentSchedule.items)) {
      // Legacy format - compare only plan 1
      const plan1Data = plansData[1]?.scheduleSubjects || [];
      const savedItems = currentSchedule.items;
      
      isSubjectsDirty = plan1Data.length !== savedItems.length ||
        plan1Data.some(subj => {
          const savedItem = savedItems.find(i => i.subjectCode === subj.code && i.classCode === subj.class);
          return !savedItem || savedItem.activated !== subj.activated;
        });
    }
  }
  
  const isDirty = currentScheduleId 
    ? (isLoading ? false : (!currentSchedule || isTitleDirty || isSubjectsDirty))
    : Object.values(plansData).some(plan => plan.scheduleSubjects.length > 0);

  useUnsavedChangesWarning(isDirty);

  return (
    <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
      {/* Left side */}
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-start mt-[-4px]">
          <ScheduleTitle />
          <AccountSaveStatusBadge />
        </div>
        <div className="flex items-start gap-2 pt-1">
          <SaveScheduleDialog />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-start gap-2 pt-1">
        <SavedSchedulesDialog />
        <ReceivedSharedSchedulesDialog />
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div className="p-10 grid gap-2 grid-cols-1 ">
      <SubjectsProvider>
        <ScheduleHeader />
        <SubjectsLoader />
        <CopyPlanDialog />
      </SubjectsProvider>
    </div>
  );
}

function SubjectsLoader() {
  const { getAllSubjects } = useAxios();
  const { selectedCampus } = useSubjects();
  const [subjects, setSubjects] = useState<SubjectsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const data = await getAllSubjects(selectedCampus || undefined);
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedCampus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <ScheduleContent subjects={subjects} />;
}

function AutoSaveToggle() {
  const { autoSaveEnabled, setAutoSaveEnabled } = useSubjects();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border">
      <Zap className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-2">
        <Label htmlFor="auto-save" className="text-sm font-medium cursor-pointer">
          Auto-save
        </Label>
        <Switch
          id="auto-save"
          checked={autoSaveEnabled}
          onCheckedChange={setAutoSaveEnabled}
        />
      </div>
    </div>
  );
}

function CreditsCounter() {
  const { calculateCurrentPlanCredits } = useSubjects();
  const currentPlanCredits = calculateCurrentPlanCredits();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border">
      <Calculator className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">
        {currentPlanCredits} créditos
      </span>
    </div>
  );
}

function ScheduleContent({ subjects }: { subjects: SubjectsType[] }) {
  const { 
    currentPlan, 
    setCurrentPlan, 
    scheduleSubjects, 
    clearCurrentPlan, 
    plansInitialized,
    selectedSemester,
    setSelectedSemester,
    selectedCampus,
    setSelectedCampus,
    showSemesterChangeModal,
    showCampusChangeModal,
    confirmSemesterChange,
    confirmCampusChange,
    cancelSemesterChange,
    cancelCampusChange,
    pendingSemester,
    pendingCampusName,
    plansData
  } = useSubjects();
  const [showClearPlanAlert, setShowClearPlanAlert] = useState(false);

  const handleClearPlanClick = () => {
    if (scheduleSubjects.length === 0) {
      toast.info("O plano atual já está vazio.");
      return;
    }
    setShowClearPlanAlert(true);
  };

  const handleProceedClearPlan = () => {
    setShowClearPlanAlert(false);
    clearCurrentPlan();
    toast.success(`Matérias do Plano ${currentPlan} removidas com sucesso!`);
  };

  const plan2HasSubjects = plansData[2]?.scheduleSubjects?.length > 0;
  const isPlan3Disabled = !plan2HasSubjects && currentPlan !== 3;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CampusSelector
            selectedCampus={selectedCampus}
            onCampusChange={setSelectedCampus}
            disabled={false}
          />
          <SemesterSelector
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            disabled={false}
          />
          <SearchSubject subjects={subjects} />
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleClearPlanClick}
          >
            <Eraser className="h-4 w-4" />
            Limpar
          </Button>
          <div className="flex items-center gap-2 border-l pl-4 dark:border-zinc-800">
            <Button 
              variant={currentPlan === 1 ? "default" : "outline"} 
              size="sm"
              onClick={() => setCurrentPlan(1)}
              className="relative"
            >
              Plano 1
            </Button>
            <Button 
              variant={currentPlan === 2 ? "default" : "outline"} 
              size="sm"
              onClick={() => setCurrentPlan(2)}
              className={`relative ${!plansInitialized.has(2) && currentPlan !== 2 ? 'text-muted-foreground border-dashed' : ''}`}
            >
              Plano 2
              {!plansInitialized.has(2) && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted"></span>
                </span>
              )}
            </Button>
            <Button 
              variant={currentPlan === 3 ? "default" : "outline"} 
              size="sm"
              onClick={() => setCurrentPlan(3)}
              disabled={isPlan3Disabled}
              className={`relative ${!plansInitialized.has(3) && currentPlan !== 3 ? 'text-muted-foreground border-dashed' : ''} ${isPlan3Disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Plano 3
              {!plansInitialized.has(3) && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted"></span>
                </span>
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AutoSaveToggle />
          <CreditsCounter />
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <SubjectsTable />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <SelectedSubject />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <WeekCalendarComponent />
        </ResizablePanel>

        <ResizableHandle />
      </ResizablePanelGroup>

      <AlertDialog open={showClearPlanAlert} onOpenChange={setShowClearPlanAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar Plano {currentPlan}</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover todas as matérias do Plano {currentPlan}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceedClearPlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, limpar plano
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SemesterChangeModal
        open={showSemesterChangeModal}
        onConfirm={() => confirmSemesterChange('')}
        onCancel={cancelSemesterChange}
        pendingSemester={pendingSemester}
      />
      <CampusChangeModal
        open={showCampusChangeModal}
        onConfirm={() => confirmCampusChange('')}
        onCancel={cancelCampusChange}
        pendingCampusName={pendingCampusName}
      />
    </>
  );
}
