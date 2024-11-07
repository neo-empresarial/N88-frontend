"use client";

import { useState } from "react";
import { useSubjects } from "../providers/subjectsContext";
import { useTheme } from "next-themes";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ClassesType } from "../types/dataType";

export default function SelectedSubject() {
  const [rowSelection, setRowSelection] = useState({});
  const {
    selectedSubject,
    setOnFocusSubjectClass,
    scheduleSubjects,
    setScheduleSubjects,
  } = useSubjects();

  async function addOrRemoveClasses(
    row: ClassesType & { isSelected: string | boolean }
  ) {
    const subject = scheduleSubjects.find(
      (subject) => subject.code === selectedSubject.code
    );

    if (!subject) {
      setScheduleSubjects([
        ...scheduleSubjects,
        {
          code: selectedSubject.code,
          classes: [row.classcode],
        },
      ]);
      return;
    }

    if (!row.isSelected) {
      const copy = [...scheduleSubjects];
      const index = copy.findIndex(
        (subject) => subject.code === selectedSubject.code
      );
      copy[index].classes.push(row.classcode);
      setScheduleSubjects(copy);
    } else {
      const copy = [...scheduleSubjects];
      const index = copy.findIndex(
        (subject) => subject.code === selectedSubject.code
      );
      const classIndex = copy[index].classes.findIndex(
        (classcode) => classcode === row.classcode
      );
      copy[index].classes.splice(classIndex, 1);
      setScheduleSubjects(copy);
    }
  }

  return (
    <div className="p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 flex justify-center items-center">
              <Checkbox
                checked={selectedSubject.classes?.length > 0}
                onCheckedChange={(value) => {
                  const allRowsSelected = value ? selectedSubject.classes : [];
                  setRowSelection(allRowsSelected);
                }}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Vagas</TableHead>
            <TableHead>Professores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedSubject.classes?.map((row) => (
            <TableRow key={row.classcode}>
              <TableCell className="w-10 flex justify-center items-center">
                <Checkbox
                  // checked={rowSelection[row.classcode] || false}
                  onCheckedChange={(value) => {
                    setRowSelection((prev) => ({
                      ...prev,
                      [row.classcode]: value,
                    }));
                    addOrRemoveClasses({ ...row, isSelected: value });
                  }}
                  aria-label={`Select ${row.classcode}`}
                />
              </TableCell>
              <TableCell>{row.classcode}</TableCell>
              <TableCell>
                {`${row.totalvacancies - row.freevacancies}/${
                  row.totalvacancies
                }`}
              </TableCell>
              <TableCell>
                {row.professors.map((prof) => prof.name).join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {selectedSubject.classes?.length === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No classes selected
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
