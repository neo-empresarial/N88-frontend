import { createContext, useState } from "react";
import { SubjectsType } from "../types/dataType";

export const SelectedSubjectContext = createContext({
  selectedSubject: {} as SubjectsType,
  setSelectedSubject: (subject: SubjectsType) => {},
});

export default function SelectedSubjectProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedSubject, setSelectedSubject] = useState({} as SubjectsType);

  return (
    <SelectedSubjectContext.Provider
      value={{ selectedSubject, setSelectedSubject }}
    >
      {children}
    </SelectedSubjectContext.Provider>
  );
}
