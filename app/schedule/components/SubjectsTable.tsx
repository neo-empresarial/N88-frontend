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
import { ChevronUp, ChevronDown } from "lucide-react";

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

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-12 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Editar</DropdownMenuLabel>
              <DropdownMenuItem>Mover para cima</DropdownMenuItem>
              <DropdownMenuItem>Mover para baixo</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      );
    },
  },
];

export default function SubjectsTable() {
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
    interestSubjects,
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
        console.log(interestSubjects);
      }}
    >
      alda
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
