import React, { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { SubjectsType } from "../types/dataType";

export type scheduleSubjectsType = {
  code: string;
  class: string;
  color?: string;
  activated: boolean;
};

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
};

const STORAGE_KEY = "schedule_subjects";
const SEARCHED_SUBJECTS_KEY = "searched_subjects";

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
  const [currentScheduleId, setCurrentScheduleId] = useState<number | null>(
    null
  );

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && scheduleSubjects.length > 0) {

        localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleSubjects));
      }
    } catch (error) {
      console.error("Error saving schedule subjects to localStorage:", error);
    }
  }, [scheduleSubjects]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && searchedSubjects.length > 0) {
        console.log(
          "Saving searched subjects to localStorage:",
          searchedSubjects
        );
        localStorage.setItem(
          SEARCHED_SUBJECTS_KEY,
          JSON.stringify(searchedSubjects)
        );
      }
    } catch (error) {
      console.error("Error saving searched subjects to localStorage:", error);
    }
  }, [searchedSubjects]);

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
