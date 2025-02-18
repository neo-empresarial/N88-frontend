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
  setScheduleSubjects: React.Dispatch<React.SetStateAction<scheduleSubjectsType[]>>;
  selectedSubject: SubjectsType;
  setSelectedSubject: React.Dispatch<React.SetStateAction<SubjectsType>>;
  onFocusSubject: { code: string };
  setOnFocusSubject: React.Dispatch<React.SetStateAction<{ code: string }>>;
  onFocusSubjectClass: { code: string; classcode: string };
  setOnFocusSubjectClass: React.Dispatch<React.SetStateAction<{ code: string; classcode: string }>>;
};

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
});

export function SubjectsProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchedSubjects, setSearchedSubjects] = useState(
    [] as SubjectsType[]
  );
  const [scheduleSubjects, setScheduleSubjects] = useState(
    [] as scheduleSubjectsType[]
  );
  const [selectedSubject, setSelectedSubject] = useState({} as SubjectsType);
  const [onFocusSubject, setOnFocusSubject] = useState({} as { code: string });
  const [onFocusSubjectClass, setOnFocusSubjectClass] = useState(
    {} as { code: string; classcode: string }
  );

  // useEffect(() => console.log({ searchedSubjects }), [searchedSubjects]);
  useEffect(() => console.log({ scheduleSubjects }), [scheduleSubjects]);
  useEffect(() => console.log({ onFocusSubject }), [onFocusSubject]);
  useEffect(() => console.log({ onFocusSubjectClass }), [onFocusSubjectClass]);

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
