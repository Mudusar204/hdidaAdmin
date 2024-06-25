"use client";

import { useState, useEffect, cloneElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  LayoutDashboard,
  Users,
  Hotel,
  Plane,
  Bus,
  User,
  UserRoundPlus,
  Database,
  BookUser,
  Utensils,
  BarChartHorizontal,
  Bath,
  Flag,
  View,
  Keyboard,
  BookUp,
  Layers3Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CommonAccordion, CommonTooltip } from "@/components";
import { Navbar } from "./Navbar";
import { Router, useRouter } from "next/router";

export default function Layout({ children }) {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const defaultRoutes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <Users />,
    },
    {
      name: "Posts",
      path: "/dashboard/posts",
      icon: <BookUp />,
    },
    {
      name: "Categories",
      path: "/dashboard/categories",
      icon: <Layers3Icon />,
    },
  ];

  if (true) {
    return (
      <main className="max-h-screen overflow-y-hidden">
        <header className="flex h-[70px] w-full items-center border-b border-gray-300">
          <Navbar />
        </header>
        <main className="flex min-h-[calc(100vh-100px)]">
          <nav
            className={cn(
              {
                "w-[250px]": sidebarToggle,
                "w-[72px]": !sidebarToggle,
              },
              "overflow-hidden transition-all"
            )}
          >
            <ul
              className="sidebar space-y-2  overflow-y-auto p-3"
              style={{
                maxHeight: "calc(100vh - 100px)",
              }}
            >
              <li
                className="flex justify-end rounded-md bg-[#1C9E7D] p-3 text-white"
                key={0}
              >
                <CommonTooltip
                  trigger={
                    <ChevronRight
                      className={cn("cursor-pointer transition-transform", {
                        "rotate-180": sidebarToggle,
                      })}
                      onClick={() => setSidebarToggle((prev) => !prev)}
                    />
                  }
                >
                  {sidebarToggle ? "Contract Sidebar" : "Expand Sidebar"}
                </CommonTooltip>
              </li>
              {defaultRoutes.map((route, i) => (
                <li key={i + 1}>
                  <button
                    className={cn(
                      {
                        "bg-gray-100": path === route.path,
                      },
                      "flex cursor-pointer items-center justify-start gap-2 rounded-md p-3 transition-colors  hover:bg-gray-100"
                    )}
                    onClick={() => router.push(route.path)}
                    // href={route.path}
                  >
                    <CommonTooltip
                      trigger={cloneElement(route.icon, {
                        className: cn("max-w-[24px] min-w-[24px] flex-1"),
                      })}
                    >
                      {route.name}
                    </CommonTooltip>
                    <span
                      className={cn("transition-all", {
                        invisible: !sidebarToggle,
                        visible: sidebarToggle,
                      })}
                    >
                      {route.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <main className="flex flex-1 border-l border-gray-300 p-4 max-h-[calc(100vh-100px)] overflow-y-scroll">
            {children}
          </main>
        </main>
      </main>
    );
  }
  return <></>;
}
