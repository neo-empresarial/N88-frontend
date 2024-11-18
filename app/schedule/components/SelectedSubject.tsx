"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ClassesType } from "../types/dataType";

export default function SelectedSubject() {
  const [rowSelection, setRowSelection] = useState<string | null>(null);
  const {
    selectedSubject,
    onFocusSubjectClass,
    setOnFocusSubjectClass,
    scheduleSubjects,
    setScheduleSubjects,
    setOnFocusSubject,
  } = useSubjects();

  const handleRowSelect = (row: ClassesType) => {
    const isSelected = rowSelection === row.classcode;

    if (isSelected) {
      // Deselect the current row
      setRowSelection(null);
      removeClass(selectedSubject.code);
    } else {
      // Select a new row, replacing the previous selection
      setRowSelection(row.classcode);
      addClass({
        code: selectedSubject.code,
        class: row.classcode,
      });
    }
  };

  const addClass = (row: { code: string; class: string }) => {
    const updatedSchedule = scheduleSubjects.filter(
      (subject) => subject.code !== selectedSubject.code
    );

    setScheduleSubjects([...updatedSchedule, row]);
  };

  const removeClass = (code: string) => {
    const updatedSchedule = scheduleSubjects.filter(
      (subject) => subject.code !== code
    );
    setScheduleSubjects(updatedSchedule);
  };

  useEffect(() => {
    // Update the row selection when the selected subject changes
    setRowSelection(
      scheduleSubjects.filter((s) => s.code === selectedSubject.code)?.[0]
        ?.class || null
    );
  }, [selectedSubject]);

  useEffect(() => {
    if (!onFocusSubjectClass.classcode) {
      if (rowSelection) {
        return setScheduleSubjects(
          scheduleSubjects.map((subject) => {
            if (subject.code === selectedSubject.code) {
              return { ...subject, class: rowSelection };
            }
            return subject;
          })
        );
      }

      return setScheduleSubjects(
        scheduleSubjects.filter(
          (subject) => subject.code !== selectedSubject.code
        )
      );
    }

    return addClass({
      code: onFocusSubjectClass.code,
      class: onFocusSubjectClass.classcode,
    });
  }, [onFocusSubjectClass]);

  return (
    <div className="p-3">
      <Table containerClassname="h-full max-h-full overflow-y-auto relative">
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
              onMouseEnter={() => {
                setOnFocusSubjectClass({
                  code: selectedSubject.code,
                  classcode: row.classcode,
                });
                setOnFocusSubject({ code: selectedSubject.code });
                return;
              }}
              onMouseLeave={() => {
                setOnFocusSubjectClass({} as any);
                setOnFocusSubject({} as any);
                return;
              }}
              className={`cursor-pointer ${
                rowSelection === row.classcode ? "bg-blue-100" : ""
              }`}
              onClick={() => handleRowSelect(row)}
              data-state={rowSelection === row.classcode ? "selected" : ""}
            >
              <TableCell>{row.classcode}</TableCell>
              <TableCell>
                {`${row.totalvacancies - row.freevacancies}/${
                  row.totalvacancies
                }`}
              </TableCell>
              <TableCell>
                {row.professors.map((prof) => (
                  <Badge
                    variant="outline"
                    key={prof.idprofessor}
                    className="m-1"
                  >
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
