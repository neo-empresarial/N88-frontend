"use client";

import { useState } from "react";
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

const column_height = "h-5";

function removeLine(subjects: SubjectsType[], subject: SubjectsType) {
  return subjects.filter((s) => s.code !== subject.code);
}

export default function SubjectsTable() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );
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
    setSelectedSubject({} as any);
  };

  const handleSelectAll = (isChecked: boolean) => {
    const newSelection = searchedSubjects.reduce((acc, row) => {
      acc[row.code] = isChecked;
      return acc;
    }, {} as { [key: string]: boolean });
    setRowSelection(newSelection);
  };

  const handleRowSelect = (row: SubjectsType, isChecked: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [row.code]: isChecked,
    }));
  };

  return (
    <div className="p-3">
      <Table containerClassname="h-fit max-h-80 overflow-y-auto relative">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 flex justify-center items-center">
              <Checkbox
                checked={
                  Object.values(rowSelection).length > 0 &&
                  Object.values(rowSelection).every((isSelected) => isSelected)
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
              onMouseLeave={() => setOnFocusSubject({} as any)}
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
              <TableCell onClick={() => setSelectedSubject(row)}>{
                scheduleSubjects.find((s) => s.code === row.code)?.class || "-"
                }</TableCell>
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
                <Button variant="outline" size="icon">
                  <ChevronUp className="h-4" />
                </Button>
                <Button variant="outline" size="icon">
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
