"use client";

import * as React from "react";
import { useContext } from "react";
import { SelectedSubjectContext } from "../providers/selectedSubjectContext";

import { useTheme } from "next-themes";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { SubjectsType } from "../types/dataType";

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
    accessorKey: "classcode",
    header: "Turma",
    cell: ({ row }) => (
      <div className={`flex items-center capitalize ${column_height}`}>
        {row.getValue("classcode")}
      </div>
    ),
  },
  {
    accessorKey: "professors",
    header: "Professores",
    cell: ({ row }) => (
      <div className={`flex items-center capitalize ${column_height}`}>
        {row.getValue("professors")}
      </div>
    ),
  }
];

export default function SelectedSubject() {
  const [rowSelection, setRowSelection] = React.useState({});
  
  const { theme } = useTheme();

  const { selectedSubject } = useContext(SelectedSubjectContext);

  // const table = useReactTable<SubjectsType>({
  //   selectedSubject,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onRowSelectionChange: setRowSelection,
  //   state: {
  //     rowSelection,
  //   },
  // });

  return (
    <div className={`p-3 w-full h-full`}>
      <div
        className={
          (selectedSubject.color
            ? theme === "light"
              ? `${selectedSubject.color[0]}`
              : `${selectedSubject.color[1]}`
            : "") +
          " " +
          "w-full h-full"
        }
      >

        {selectedSubject.code}
      </div>
    </div>
  );
}
