import { createContext, useState } from "react";
import { SubjectsType } from "../types/dataType";

export const onFocusSubjectContext = createContext({
  onFocusSubject: {} as SubjectsType,
  setOnFocusSubject: (subject: SubjectsType) => {},
});

export default function OnFocusSubjectProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [onFocusSubject, setOnFocusSubject] = useState({} as SubjectsType);

  return (
    <onFocusSubjectContext.Provider
      value={{ onFocusSubject, setOnFocusSubject }}
    >
      {children}
    </onFocusSubjectContext.Provider>
  );
}