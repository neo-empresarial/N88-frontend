"use client";

import { useEffect, useState, useRef } from "react";
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

  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);

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
    setScheduleSubjects(
      scheduleSubjects.map((subject) => {
        if (subject.code === row.code) {
          return { ...subject, class: row.class };
        }
        return subject;
      })
    );
  };

  const removeClass = (code: string) => {
    setScheduleSubjects(
      scheduleSubjects.map((subject) => {
        if (subject.code === code) {
          return { ...subject, class: "" };
        }
        return subject;
      })
    );
  };

  useEffect(() => {
    const isClassSelected =
      scheduleSubjects.filter((s) => s.code === selectedSubject.code)?.[0]
        ?.class || null;
    
    if (isClassSelected) {
      return setRowSelection(isClassSelected);
    }

    // Set the first class as selected by default
    if (selectedSubject.classes?.length) {
      setRowSelection(selectedSubject.classes[0].classcode);
      handleRowSelect(selectedSubject.classes[0]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (!onFocusSubjectClass.classcode) {
      if (rowSelection) {
        return addClass({
          code: selectedSubject.code,
          class: rowSelection,
        });
      }

      return removeClass(selectedSubject.code);
    }

    return addClass({
      code: onFocusSubjectClass.code,
      class: onFocusSubjectClass.classcode,
    });
  }, [onFocusSubjectClass]);

  useEffect(() => {
    const updateMaxHeight = () => {
      if (tableContainerRef.current) {
        const parentHeight =
          tableContainerRef.current.getBoundingClientRect().height;
        setMaxHeight(`${parentHeight}px`);
      }
    };

    // Create a ResizeObserver to observe height changes in the parent div
    const observer = new ResizeObserver(() => {
      updateMaxHeight();
    });

    if (tableContainerRef.current) {
      observer.observe(tableContainerRef.current); // Start observing
      updateMaxHeight(); // Set initial height
    }

    // Cleanup the observer on component unmount
    return () => {
      if (tableContainerRef.current) {
        observer.unobserve(tableContainerRef.current);
      }
    };
  }, []);

  return (
    <div ref={tableContainerRef} className="p-3 h-full">
      <Table
        containerClassname="h-full overflow-y-auto relative"
        style={{ maxHeight: maxHeight }} // Apply max-height dynamically
      >
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
                setOnFocusSubjectClass({ code: "", classcode: "" });
                setOnFocusSubject({ code: "" });
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
