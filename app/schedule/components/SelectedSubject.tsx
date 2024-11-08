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
import { Badge } from "@/components/ui/badge";

export default function SelectedSubject() {
  const [rowSelection, setRowSelection] = useState({});
  const {
    selectedSubject,
    setOnFocusSubjectClass,
    scheduleSubjects,
    setScheduleSubjects,
  } = useSubjects();

  const addOrRemoveClasses = (row: ClassesType & {isSelected: boolean | string}) => {
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

  return (
    <div className="p-3 ">
      <Table containerClassname="h-fit max-h-80 overflow-y-auto relative">
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
            <TableRow
              key={row.classcode}
              onMouseEnter={() =>
                setOnFocusSubjectClass({
                  code: selectedSubject.code,
                  classcode: row.classcode,
                })
              }
              onMouseLeave={() => setOnFocusSubjectClass({} as any)}
            >
              <TableCell className="w-10 flex justify-center items-center">
                <Checkbox
                  // checked={rowSelection[row.classcode] || false}
                  onCheckedChange={(value) => {
                    setRowSelection((prev) => ({
                      ...prev,
                      [row.classcode]: value,
                    }));
                    return addOrRemoveClasses({ ...row, isSelected: value });
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
