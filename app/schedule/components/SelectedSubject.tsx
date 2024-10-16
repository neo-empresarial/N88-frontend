"use client";

import * as React from "react";
import { useContext } from "react";
import { SelectedSubjectContext } from "../providers/selectedSubjectContext";
import { onFocusSubjectContext } from "../providers/onFocusSubjectContext";

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
import { ClassesType } from "../types/dataType";

const column_height = "h-5";

export const columns: ColumnDef<ClassesType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center w-10">
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
      <div className={`flex justify-center items-center w-10 ${column_height}`}>
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
    header: "Vagas",
    accessorFn: (row) =>
      `${row.totalvacancies - row.freevacancies}/${row.totalvacancies}`,

    // cell: ({ row }) => (
    //   <div className={`flex items-center ${column_height}`}>
    //     {row.getValue("freevacancies")}/{row.getValue("totalvacancies")}
    //   </div>
    // ),
  },
  {
    accessorKey: "professors",
    header: "Professores",
    cell: ({ row }) => (
      <div className={`flex items-center capitalize ${column_height}`}>
        {row
          .getValue("professors")
          .map((professor) => professor.name)
          .join(", ")}
      </div>
    ),
  },
];

export default function SelectedSubject() {
  const [rowSelection, setRowSelection] = React.useState({});

  const { theme } = useTheme();

  const { selectedSubject } = useContext(SelectedSubjectContext);
  const { setOnFocusSubject } = useContext(onFocusSubjectContext);

  const table = useReactTable<ClassesType>({
    data: selectedSubject.classes || [],
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
        {table.getRowModel().rows?.length ? (
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
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${selectedSubject.color}`}
                  onMouseEnter={() => setOnFocusSubject(selectedSubject)}
                  onMouseLeave={() => setOnFocusSubject({})}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
