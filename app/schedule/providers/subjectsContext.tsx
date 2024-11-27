import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { SubjectsType } from "../types/dataType";

export type scheduleSubjectsType = {
  code: string;
  class: string;
  color?: string;
  activated: boolean;
};

export const SubjectsContext = createContext({
  searchedSubjects: [] as SubjectsType[],
  setSearchedSubjects: (subjects: SubjectsType[]) => {},
  scheduleSubjects: [] as scheduleSubjectsType[],
  setScheduleSubjects: (subjects: scheduleSubjectsType[]) => {},
  selectedSubject: {} as SubjectsType,
  setSelectedSubject: (subject: SubjectsType) => {},
  onFocusSubject: {} as { code: string },
  setOnFocusSubject: (subject: { code: string }) => {},
  onFocusSubjectClass: {} as { code: string; classcode: string },
  setOnFocusSubjectClass: (subject: { code: string; classcode: string }) => {},
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
