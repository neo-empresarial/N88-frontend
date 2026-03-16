import React, { useContext, useEffect, useCallback, createContext, useState } from "react";
import { SubjectsType } from "../types/dataType";
import { restoreColorUsage } from "../utils/colorUtils";

export type scheduleSubjectsType = {
  code: string;
  class: string;
  color?: string;
  activated: boolean;
  schedules?: string;
};

type LocalSaveStatus = "idle" | "saving" | "saved";

type SubjectsContextType = {
  searchedSubjects: SubjectsType[];
  setSearchedSubjects: React.Dispatch<React.SetStateAction<SubjectsType[]>>;
  scheduleSubjects: scheduleSubjectsType[];
  setScheduleSubjects: React.Dispatch<
    React.SetStateAction<scheduleSubjectsType[]>
  >;
  selectedSubject: SubjectsType;
  setSelectedSubject: React.Dispatch<React.SetStateAction<SubjectsType>>;
  onFocusSubject: { code: string };
  setOnFocusSubject: React.Dispatch<React.SetStateAction<{ code: string }>>;
  onFocusSubjectClass: { code: string; classcode: string };
  setOnFocusSubjectClass: React.Dispatch<
    React.SetStateAction<{ code: string; classcode: string }>
  >;
  currentScheduleId: number | null;
  setCurrentScheduleId: React.Dispatch<React.SetStateAction<number | null>>;
  totalCredits: number;
  setTotalCredits: React.Dispatch<React.SetStateAction<number>>;
  localSaveStatus: LocalSaveStatus;
  clearLocalSchedule: () => void;
  scheduleTitle: string;
  setScheduleTitle: React.Dispatch<React.SetStateAction<string>>;
};

const STORAGE_KEY = "schedule_subjects";
const SEARCHED_SUBJECTS_KEY = "searched_subjects";
const STORAGE_TITLE_KEY = "schedule_title";
const STORAGE_CURRENT_ID_KEY = "current_schedule_id";

export const SubjectsContext = createContext<SubjectsContextType>({
  searchedSubjects: [],
  setSearchedSubjects: () => {},
  scheduleSubjects: [],
  setScheduleSubjects: () => {},
  selectedSubject: {} as SubjectsType,
  setSelectedSubject: () => {},
  onFocusSubject: { code: "" },
  setOnFocusSubject: () => {},
  onFocusSubjectClass: { code: "", classcode: "" },
  setOnFocusSubjectClass: () => {},
  currentScheduleId: null,
  setCurrentScheduleId: () => {},
  totalCredits: 0,
  setTotalCredits: () => {},
  localSaveStatus: "idle",
  clearLocalSchedule: () => {},
  scheduleTitle: "Grade sem título",
  setScheduleTitle: () => {},
});

export function SubjectsProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load initial state from localStorage
  const [searchedSubjects, setSearchedSubjects] = useState<SubjectsType[]>(
    () => {
      try {
        if (typeof window !== "undefined") {
          const savedSubjects = localStorage.getItem(SEARCHED_SUBJECTS_KEY);
          return savedSubjects ? JSON.parse(savedSubjects) : [];
        }
      } catch (error) {
        console.error(
          "Error loading searched subjects from localStorage:",
          error
        );
      }
      return [];
    }
  );

  const [scheduleSubjects, setScheduleSubjects] = useState<
    scheduleSubjectsType[]
  >(() => {
    try {
      if (typeof window !== "undefined") {
        const savedSubjects = localStorage.getItem(STORAGE_KEY);
        return savedSubjects ? JSON.parse(savedSubjects) : [];
      }
    } catch (error) {
      console.error(
        "Error loading schedule subjects from localStorage:",
        error
      );
    }
    return [];
  });

  const [selectedSubject, setSelectedSubject] = useState({} as SubjectsType);
  const [onFocusSubject, setOnFocusSubject] = useState({} as { code: string });
  const [onFocusSubjectClass, setOnFocusSubjectClass] = useState(
    {} as { code: string; classcode: string }
  );
  const [currentScheduleId, setCurrentScheduleId] = useState<number | null>(() => {
    try {
      if (typeof window !== "undefined") {
        const savedId = localStorage.getItem(STORAGE_CURRENT_ID_KEY);
        return savedId ? Number(savedId) : null;
      }
    } catch {}
    return null;
  });
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [localSaveStatus, setLocalSaveStatus] = useState<LocalSaveStatus>("idle");
  const [scheduleTitle, setScheduleTitle] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(STORAGE_TITLE_KEY) || "Grade sem título";
      }
    } catch {}
    return "Grade sem título";
  });

  const clearLocalSchedule = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SEARCHED_SUBJECTS_KEY);
    } catch (e) {
      console.error("Error clearing local schedule:", e);
    }
    setScheduleSubjects([]);
    setSearchedSubjects([]);
    setCurrentScheduleId(null);
    setLocalSaveStatus("idle");
    setScheduleTitle("Grade sem título");
    try {
      localStorage.removeItem(STORAGE_TITLE_KEY);
      localStorage.removeItem(STORAGE_CURRENT_ID_KEY);
    } catch (e) {}
  }, []);

  // Restore color usage on mount so new subjects don't repeat colors
  // already assigned to subjects loaded from localStorage.
  useEffect(() => {
    if (searchedSubjects.length > 0) {
      const pairs = searchedSubjects
        .filter((s) => s.color)
        .map((s) => s.color as [string, string]);
      restoreColorUsage(pairs);
    }
    // Only run on mount — deps intentionally empty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setLocalSaveStatus("saving");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleSubjects));
      setLocalSaveStatus("saved");
    } catch (error) {
      console.error("Error saving schedule subjects to localStorage:", error);
      setLocalSaveStatus("idle");
    }
  }, [scheduleSubjects]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        SEARCHED_SUBJECTS_KEY,
        JSON.stringify(searchedSubjects)
      );
    } catch (error) {
      console.error("Error saving searched subjects to localStorage:", error);
    }
  }, [searchedSubjects]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_TITLE_KEY, scheduleTitle);
    } catch (error) {}
  }, [scheduleTitle]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (currentScheduleId !== null) {
        localStorage.setItem(STORAGE_CURRENT_ID_KEY, currentScheduleId.toString());
      } else {
        localStorage.removeItem(STORAGE_CURRENT_ID_KEY);
      }
    } catch (error) {}
  }, [currentScheduleId]);

  return (
    <SubjectsContext.Provider
      value={{
        searchedSubjects,
        setSearchedSubjects,
        scheduleSubjects,
        setScheduleSubjects,
        selectedSubject,
        setSelectedSubject,
        onFocusSubject,
        setOnFocusSubject,
        onFocusSubjectClass,
        setOnFocusSubjectClass,
        currentScheduleId,
        setCurrentScheduleId,
        totalCredits,
        setTotalCredits,
        localSaveStatus,
        clearLocalSchedule,
        scheduleTitle,
        setScheduleTitle,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error("useSubjects must be used within a SubjectsProvider");
  }
  return context;
}
