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
import SaveScheduleDialog from "./components/SaveScheduleDialog";
import SavedSchedulesDialog from "./components/SavedSchedulesDialog";
import ReceivedSharedSchedulesDialog from "./components/ReceivedSharedSchedulesDialog";
import { SubjectsType } from "./types/dataType";

import { useEffect, useState } from "react";
import useAxios from "@/app/api/AxiosInstance";
import { SubjectsProvider, useSubjects } from "./providers/subjectsContext";
import { CheckCircle, Loader2, Cloud, CloudOff, AlertCircle, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnsavedChangesWarning } from "@/app/hooks/useUnsavedChangesWarning";
import { useSavedSchedulesQuery } from "@/app/hooks/useSavedSchedules";
import { useSession } from "@/app/hooks/useSession";
import { SavedSchedule } from "@/app/services/savedSchedulesService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AccountSaveStatusBadge() {
  const { scheduleSubjects, currentScheduleId, scheduleTitle, localSaveStatus } = useSubjects();
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
  const isSubjectsDirty = 
    scheduleSubjects.length !== currentSchedule.items.length ||
    scheduleSubjects.some(subj => {
      const savedItem = currentSchedule.items.find(i => i.subjectCode === subj.code && i.classCode === subj.class);
      return !savedItem || savedItem.activated !== subj.activated;
    });

  if (isTitleDirty || isSubjectsDirty) {
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
    <div className="flex items-center gap-2 group min-h-[40px]">
      <h1 className="text-3xl font-bold">{scheduleTitle}</h1>
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

function ScheduleHeader() {
  const { scheduleSubjects, currentScheduleId, scheduleTitle } = useSubjects();
  const { isAuthenticated } = useSession();
  const { savedSchedules, isLoading } = useSavedSchedulesQuery(isAuthenticated);

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
  const { getAllSubjects } = useAxios();
  const [subjects, setSubjects] = useState<SubjectsType[]>([]);

  useEffect(() => {
    getAllSubjects().then((data: SubjectsType[]) => {
      setSubjects(data);
    });
    // getAllSubjects is recreated on every render by useAxios() — intentionally
    // omitted from deps so we only fetch once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-10 grid gap-2 grid-cols-1 ">
      <SubjectsProvider>
        <ScheduleHeader />
        
        <div className="mb-4 flex items-center gap-4">
          <SearchSubject subjects={subjects} />
          <div className="flex items-center gap-2 border-l pl-4 dark:border-zinc-800">
            <Button variant="outline" size="sm">Plano 1</Button>
            <Button variant="outline" size="sm">Plano 2</Button>
            <Button variant="outline" size="sm">Plano 3</Button>
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
      </SubjectsProvider>
    </div>
  );
}
