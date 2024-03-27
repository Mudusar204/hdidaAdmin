"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getRowModel,
  flexRender,
} from "@tanstack/react-table";
import { XCircle,CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const page = () => {
  const data = React.useMemo(
    () => [
      {
        firstName: "Tanner",
        lastName: "Linsley",
        age: 33,
        visits: 100,
        progress: 50,
        status: "Married",
      },
      {
        firstName: "Kevin",
        lastName: "Vandy",
        age: 27,
        visits: 200,
        progress: 100,
        status: "Single",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: " Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },
      {
        accessorKey: "isVerified",
        header: "Verified",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div>
        <p className="text-3xl font-bold text-center mb-4">Users</p>
      </div>
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
