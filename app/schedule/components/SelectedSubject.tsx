"use client";

import { useState } from "react";
import { useSubjects } from "../providers/subjectsContext";
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ClassesType } from "../types/dataType";
import { Badge } from "@/components/ui/badge";

export default function SelectedSubject() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const {
    selectedSubject,
    setOnFocusSubjectClass,
    scheduleSubjects,
    setScheduleSubjects,
  } = useSubjects();

  const addOrRemoveClasses = (row: ClassesType & { isSelected: boolean }) => {
    const subject = scheduleSubjects.find(
      (subject) => subject.code === selectedSubject.code
    );

    if (!subject) {
      setScheduleSubjects([
        ...scheduleSubjects,
        { code: selectedSubject.code, classes: [row.classcode] },
      ]);
      return;
    }

    const updatedSchedule = [...scheduleSubjects];
    const index = updatedSchedule.findIndex(
      (subject) => subject.code === selectedSubject.code
    );

    if (row.isSelected) {
      updatedSchedule[index].classes.push(row.classcode);
    } else {
      const classIndex = updatedSchedule[index].classes.findIndex(
        (classcode) => classcode === row.classcode
      );
      updatedSchedule[index].classes.splice(classIndex, 1);
    }

    setScheduleSubjects(updatedSchedule);
  };

  const handleSelectAll = (isChecked: boolean) => {
    const newSelection = selectedSubject.classes.reduce((acc, row) => {
      acc[row.classcode] = isChecked;
      return acc;
    }, {} as { [key: string]: boolean });
    setRowSelection(newSelection);

    selectedSubject.classes.forEach((row) => {
      addOrRemoveClasses({ ...row, isSelected: isChecked });
    });
  };

  const handleRowSelect = (row: ClassesType, isChecked: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [row.classcode]: isChecked,
    }));
    addOrRemoveClasses({ ...row, isSelected: isChecked });
  };

  return (
    <div className="p-3 ">
      <Table containerClassname="h-fit max-h-80 overflow-y-auto relative">
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Vagas</TableHead>
            <TableHead>Professores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedSubject.classes?.map((row) => (
            <TableRow
              key={row.classcode}
              onMouseEnter={() =>
                setOnFocusSubjectClass({
                  code: selectedSubject.code,
                  classcode: row.classcode,
                })
              }
              onMouseLeave={() => setOnFocusSubjectClass({} as any)}
              className="cursor-pointer"
              onClick={() => handleRowSelect(row, !rowSelection[row.classcode])}
              
            >
              <TableCell>{row.classcode}</TableCell>
              <TableCell>
                {`${row.totalvacancies - row.freevacancies}/${
                  row.totalvacancies
                }`}
              </TableCell>
              <TableCell>
                {row.professors.map((prof) => (
                  <Badge key={prof.idprofessor} className="m-1">
                    {prof.name}
                  </Badge>
                ))}
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
