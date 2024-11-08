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
  TableCaption,
} from "@/components/ui/table";

import { SubjectsType } from "../types/dataType";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const column_height = "h-5";

function removeLine(subjects: SubjectsType[], subject: SubjectsType) {
  return subjects.filter((s) => s.code !== subject.code);
}

export default function SubjectsTable() {
  const [rowSelection, setRowSelection] = useState({});
  const { theme } = useTheme();
  const { searchedSubjects, setSelectedSubject, setOnFocusSubject } =
    useSubjects();

  return (
    <div className="p-3">
      <Table containerClassname="h-fit max-h-80 overflow-y-auto relative"> {/* Ajustar o max-auto automaticamente para a altura do bloco da tabela */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 flex justify-center items-center">
              <Checkbox
                // checked={searchedSubjects.every((row) => row.selected)}
                // onCheckedChange={(value) => {
                //   searchedSubjects.forEach((row) => (row.selected = value));
                //   setRowSelection(
                //     searchedSubjects.reduce(
                //       (acc, row, idx) => ({ ...acc, [idx]: value }),
                //       {}
                //     )
                //   );
                // }}
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
          {searchedSubjects.map((row, idx) => (
            <TableRow
              key={row.code}
              className={`cursor-pointer ${
                row.color && Array.isArray(row.color)
                  ? theme === "light"
                    ? row.color[0]
                    : row.color[1]
                  : ""
              }`}
              onClick={() => setSelectedSubject(row)}
              onMouseEnter={() => setOnFocusSubject({ code: row.code })}
              onMouseLeave={() => setOnFocusSubject({} as any)}
            >
              <TableCell className="w-10 flex justify-center items-center">
                <Checkbox
                  // checked={!!rowSelection[idx]}
                  onCheckedChange={(value) =>
                    setRowSelection((prev) => ({ ...prev, [idx]: value }))
                  }
                  aria-label="Select row"
                />
              </TableCell>
              <TableCell>{row.code}</TableCell>
              <TableCell>X</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell className="flex justify-end space-x-2">
                <Button variant="outline" size="icon">
                  <ChevronUp className="h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronDown className="h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash
                    className="h-4"
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
