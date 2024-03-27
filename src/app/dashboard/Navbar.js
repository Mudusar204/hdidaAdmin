"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, UserCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getUserDetails } from "@/store/userSlice";
export function Navbar() {
  const router = useRouter();

  const user = useSelector((state) => state.userSlice.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserDetails());
  }, []);
  console.log(user, "user----------------");
  const logout=async()=>{
	await localStorage.removeItem("role");
	await localStorage.removeItem("userId");
	await localStorage.removeItem("token");
	router.push("/login");
  }
  return (
    // <main>
    <div className="flex flex-1 w-[100%]  items-center justify-between px-10">
      <h1 className="flex">
        logo{" "}
        {/* <img src='/images/logo-full.png' alt='' className='max-w-[120px] flex-1' /> */}
      </h1>
      <nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center">
              <UserCircle2 className="mr-2 h-10 w-10" />
              <span>{user ? user?.data?.user?.name : "no_username"}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Link href={"/dashboard/profile"} className="flex">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
    // </main>
  );
}
