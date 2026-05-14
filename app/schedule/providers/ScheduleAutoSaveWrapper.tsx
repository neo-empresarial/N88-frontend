"use client";

import React, { useCallback } from "react";
import { useSubjects } from "./subjectsContext";
import { useSavedSchedulesQuery } from "@/app/hooks/useSavedSchedules";
import { useSession } from "@/app/hooks/useSession";
import { useAutoSave } from "@/app/hooks/useAutoSave";
import { removeMultipleFromStorage } from "../utils/persistenceUtils";

const STORAGE_KEYS_TO_CLEAR = [
  "plans_data",
  "schedule_subjects",
  "searched_subjects",
  "schedule_title",
];

export function ScheduleAutoSaveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    autoSaveEnabled,
    currentScheduleId,
    plansData,
    scheduleTitle,
    localSaveStatus,
    getPlansDataForSave,
    selectedSemester,
    selectedCampus,
  } = useSubjects();

  const { isAuthenticated } = useSession();
  const { updateScheduleAsync } = useSavedSchedulesQuery(isAuthenticated);

  const autoSaveData = {
    plansData,
    scheduleTitle,
    currentScheduleId,
  };

   const handleAutoSave = useCallback(async () => {
     if (!currentScheduleId || !isAuthenticated) return;

     try {
       console.log("[auto-save] Starting auto-save...");
       const plansForSave = getPlansDataForSave();
       await updateScheduleAsync({
         id: currentScheduleId,
         title: scheduleTitle,
         semester: selectedSemester || undefined,
         campus: selectedCampus || undefined,
         plans: plansForSave,
       });

       console.log("[auto-save] Auto-save successful, clearing localStorage...");
       removeMultipleFromStorage(STORAGE_KEYS_TO_CLEAR);
     } catch (error) {
       console.error("Auto-save error:", error);
     }
   }, [
    currentScheduleId,
    isAuthenticated,
    scheduleTitle,
    selectedSemester,
    selectedCampus,
    getPlansDataForSave,
    updateScheduleAsync,
  ]);

  useAutoSave({
    data: autoSaveData,
    isEnabled:
      autoSaveEnabled &&
      !!currentScheduleId &&
      isAuthenticated &&
      localSaveStatus === "modified",
    onSave: handleAutoSave,
    debounceMs: 1000,
  });

  return <>{children}</>;
}
