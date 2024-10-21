import { createContext, useState } from "react";
import { SubjectsType } from "../types/dataType";

export const SelectedSubjectContext = createContext({
  selectedSubject: {} as SubjectsType,
  setSelectedSubject: (subject: SubjectsType) => {},
  interestSubjects: [] as SubjectsType[],
  setInterestSubjects: (subjects: SubjectsType[]) => {},
});

export default function SelectedSubjectProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedSubject, setSelectedSubject] = useState({} as SubjectsType);
  const [interestSubjects, setInterestSubjects] = useState<SubjectsType[]>([]);

  return (
    <SelectedSubjectContext.Provider
      value={{
        selectedSubject,
        setSelectedSubject,
        interestSubjects,
        setInterestSubjects,
      }}
    >
      {children}
    </SelectedSubjectContext.Provider>
  );
}
