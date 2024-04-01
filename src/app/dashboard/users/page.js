"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  XCircle,
  CheckCircle2,
  Trash2,
  CircleEllipsisIcon,
  Edit,
  Copy,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const page = () => {
  const router=useRouter()
  const [users, setUser] = useState([]);
  const [visibleActionBox, setVisibleActionBox] = useState(null);
  const getAllUsers = async () => {
    try {
      toast.dismiss();
      toast.loading("Loading...");
      const token = await localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/getAllUsers",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
      toast.dismiss();
      setUser(response?.data?.data);
    } catch (error) {
      toast.dismiss();

      toast.error(error?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  const deleteUser = async (userId) => {
    try {
      toast.loading("Deleting user...");
      console.log(userId, "userId");
      const token = await localStorage.getItem("token");
      const response = await axios.delete(
        "http://localhost:5000/api/admin/deleteUser",
        {
          params: {
            id: userId,
          },
          headers: {
            Authorization: token,
          },
        }
      );
      toast.dismiss()
      toast.success("User deleted successfully");
      
      let newUsers = users.filter((user) => user._id !== userId);
      setUser(newUsers);
      console.log(newUsers.length, "newUsers",users.length,"users",users[0],"users[0]");

      // Optionally, add some user feedback here (like a toast notification)
      console.log("User deleted successfully");
    } catch (error) {
      toast.dismiss();
      toast.error(error?.message, "Failed to delete the user");
      console.error("Failed to delete the user:", error);
      // Optionally, notify the user of the error
    }
  };

  const copyToClipboard = async (rowData) => {
    try {
      const rowText = JSON.stringify(rowData, null, 2); // Convert row data to formatted string
      await navigator.clipboard.writeText(rowText);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  const data = React.useMemo(() => users, [users]);

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
      {
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="relative">
            <CircleEllipsisIcon
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the event from bubbling up to the document
                setVisibleActionBox(
                  visibleActionBox === info.row.id ? null : info.row.id
                );
              }}
            />
            {visibleActionBox === info.row.id && (
              // <OutsideClickHandler onOutsideClick={() => setVisibleActionBox(null)}>
              <div
                className="absolute top-[25px] left-[0px] border-gray-700 border  rounded-md flex flex-col gap-2 bg-slate-100 z-10 p-2"
                key={`ActionBox-${visibleActionBox}`}
              >
                <button
                  onClick={() => copyToClipboard(info.row.original)}
                  className="flex items-center"
                >
                  <Copy />
                  <p> Copy</p>
                </button>
                <button onClick={()=>router.push("/dashboard/users/addNewUser")} className="flex items-center">
                  <User />
                  <p className="whitespace-nowrap"> Add User</p>
                </button>

                <button
                  onClick={() => {
                    deleteUser(info.row.original._id),
                      console.log(info.row.original, "info");
                  }}
                  className="flex items-center text-red-500"
                >
                  <Trash2 />

                  <p> Delete </p>
                </button>
              </div>
              // </OutsideClickHandler>
            )}
          </div>
        ),
      },
    ],
    [visibleActionBox]
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
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === "isVerified") {
                    return (
                      <TableCell key={cell.id}>
                        {cell.getValue() === true ? (
                          <CheckCircle2 className="text-green-500" />
                        ) : cell.getValue() === false ? (
                          <XCircle className="text-red-500" />
                        ) : (
                          cell.getValue()
                        )}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
