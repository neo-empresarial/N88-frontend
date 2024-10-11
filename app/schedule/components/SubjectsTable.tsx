"use client";

import * as React from "react";
import { useContext } from "react";
import { SelectedSubjectContext } from "../providers/selectedSubjectContext";

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

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Separator } from "@/components/ui/separator";

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

export default function SubjectsTable({ data }: { data: SubjectsType[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const { theme } = useTheme();

  const { setSelectedSubject } = useContext(SelectedSubjectContext);

  const table = useReactTable<SubjectsType>({
    data,
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
    <div className="p-3">
      <div className="flex flex-row items-center">
        <Label className="text-base mx-2">Pesquise pela matéria: </Label>
        <Input className="min-w-12 w-1/4"></Input>
      </div>
      <Separator className="my-2" />
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
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
