"use client";

import { useState, useEffect, useRef } from "react";
import { useSubjects } from "../providers/subjectsContext";
import { ChevronUp, ChevronDown, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SubjectsType } from "../types/dataType";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubjectsTable() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );

  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);

  const { theme } = useTheme();
  const {
    searchedSubjects,
    setSelectedSubject,
    setOnFocusSubject,
    setSearchedSubjects,
    setScheduleSubjects,
    scheduleSubjects,
  } = useSubjects();

  const removeSubject = (subject: SubjectsType) => {
    setSearchedSubjects(
      searchedSubjects.filter((s) => s.code !== subject.code)
    );
    setScheduleSubjects(
      scheduleSubjects.filter((s) => s.code !== subject.code)
    );
    setSelectedSubject({} as SubjectsType);
  };

  const handleSelectAll = (isChecked: boolean) => {
    const newSelection = searchedSubjects.reduce((acc, row) => {
      acc[row.code] = isChecked;
      return acc;
    }, {} as { [key: string]: boolean });
    setRowSelection(newSelection);
    
    const updatedSchedule = scheduleSubjects.map((subject) => {
      return { ...subject, activated: isChecked };
    });
    setScheduleSubjects(updatedSchedule);
  };

  const handleRowSelect = (row: SubjectsType, isChecked: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [row.code]: isChecked,
    }));
    
    const updatedSchedule = scheduleSubjects.map((subject) => {
      if (subject.code === row.code) {
        return { ...subject, activated: isChecked };
      }
      return subject;
    });

    setScheduleSubjects(updatedSchedule);
  };

  const reorderSearchedSubjects = (code: string, direction: "up" | "down") => {
    const index = searchedSubjects.findIndex((s) => s.code === code);
    if (index === -1) return;

    const updatedSubjects = [...searchedSubjects];
    const [removed] = updatedSubjects.splice(index, 1);

    if (direction === "up") {
      // If it's already the first item, wrap to the end
      if (index === 0) {
        updatedSubjects.push(removed);
      } else {
        // Otherwise, move it up by one position
        updatedSubjects.splice(index - 1, 0, removed);
      }
    } else {
      // direction: "down"
      // If it's already the last item, wrap to the start
      if (index === searchedSubjects.length - 1) {
        updatedSubjects.unshift(removed);
      } else {
        // Otherwise, move it down by one position
        updatedSubjects.splice(index + 1, 0, removed);
      }
    }

    setSearchedSubjects(updatedSubjects);
  }

  // Sync `rowSelection` with `searchedSubjects`, selecting all rows by default
  useEffect(() => {
    const newSelection = searchedSubjects.reduce((acc, row) => {
      acc[row.code] = true; // Select all by default
      return acc;
    }, {} as { [key: string]: boolean });

    setRowSelection(newSelection);
  }, [searchedSubjects]);

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
            <TableHead className="w-10 flex justify-center items-center">
              <Checkbox
                checked={
                  Object.values(rowSelection).length === searchedSubjects.length &&
                  Object.values(rowSelection).every((val) => val) &&
                  searchedSubjects.length > 0
                }
                onCheckedChange={(value) => handleSelectAll(!!value)}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Nome da disciplina</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchedSubjects.map((row) => (
            <TableRow
              key={row.code}
              className={`cursor-pointer`}
              onMouseEnter={() => setOnFocusSubject({ code: row.code })}
              onMouseLeave={() => setOnFocusSubject({} as { code: string })}
            >
              <TableCell className="w-10 flex justify-center items-center">
                <Checkbox
                  checked={rowSelection[row.code] || false}
                  onCheckedChange={(value) =>
                    handleRowSelect(row, value as boolean)
                  }
                  aria-label={`Select ${row.code}`}
                />
              </TableCell>
              <TableCell onClick={() => setSelectedSubject(row)}>
                {row.code}
              </TableCell>
              <TableCell onClick={() => setSelectedSubject(row)}>
                {scheduleSubjects.find((s) => s.code === row.code)?.class ||
                  "-"}
              </TableCell>
              <TableCell onClick={() => setSelectedSubject(row)}>
                <Badge
                  variant="outline"
                  className={`${
                    row.color && Array.isArray(row.color)
                      ? theme === "light"
                        ? row.color[0] + " text-black"
                        : row.color[1] + " text-white"
                      : ""
                  }`}
                >
                  {row.name}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end space-x-2">
                <Button variant="outline" size="icon" onClick={() => reorderSearchedSubjects(row.code, 'up')}>
                  <ChevronUp className="h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => reorderSearchedSubjects(row.code, 'down')}>
                  <ChevronDown className="h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeSubject(row)}
                >
                  <Trash className="h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
