"use client";

import { useState, useContext, useEffect } from "react";
import { SelectedSubjectContext } from "../providers/selectedSubjectContext";
import { onFocusSubjectContext } from "../providers/onFocusSubjectContext";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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

const column_height = "h-5";

function removeLine(subjects: SubjectsType[], subject: SubjectsType) {
  return subjects.filter((s) => s.code !== subject.code);
}
export const columns: ColumnDef<SubjectsType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className={`flex justify-center items-center ${column_height}`}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <div className={`flex items-center capitalize ${column_height}`}>
        {row.getValue("code")}
      </div>
    ),
  },
  {
    accessorKey: "classcode",
    header: "Turma",
    cell: ({ row }) => (
      <div className={`flex items-center capitalize ${column_height}`}>
        {row.getValue("classcode")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nome da disciplina",
    cell: ({ row }) => (
      <div className={`flex items-center capitalize ${column_height}`}>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className={`flex justify-end ${column_height}`}>
          <ChevronUp className="h-4 m-1" />

          <ChevronDown className="h-4 m-1" />
          <Trash
            className="h-4 m-1"
            onClick={() => {
              console.log("tem que remover aqui");
            }}
          />
        </div>
      );
    },
  },
];

export default function SubjectsTable(data: { data: SubjectsType[] }) {
  const [rowSelection, setRowSelection] = useState({});
  const { theme } = useTheme();

  const {
    interestSubjects,
    selectedSubject,
    setInterestSubjects,
    setSelectedSubject,
  } = useContext(SelectedSubjectContext);
  const { setOnFocusSubject } = useContext(onFocusSubjectContext);

  useEffect(() => {
    console.log(interestSubjects);
  }, [interestSubjects]);

  const table = useReactTable<SubjectsType>({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div
      className="p-3"
      onClick={() => {
        console.log(data);
      }}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table?.getRowModel()?.rows?.length ? (
            table?.getRowModel()?.rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={
                  (row.original.color && Array.isArray(row.original.color)
                    ? theme === "light"
                      ? `${row.original.color[0]}`
                      : `${row.original.color[1]}`
                    : "") +
                  " " +
                  "cursor-pointer"
                }
                onClick={() => {
                  setSelectedSubject(row.original);
                }}
                onMouseEnter={() => setOnFocusSubject(row.original)}
                onMouseLeave={() => setOnFocusSubject({} as SubjectsType)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
