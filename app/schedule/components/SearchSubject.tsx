"use client"

import { useSubjects } from "../providers/subjectsContext";
import { SubjectsType } from "../types/dataType";

export default function SearchSubject(data: { data: SubjectsType[] }) {
  const { setSearchedSubjects } = useSubjects();

  setSearchedSubjects(data.data);
  return (
    <div>
      <h1>Search Subject</h1>
    </div>
  );
}