"use client";
// @ts-ignore
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import { useDispatch } from "react-redux";
import { setUserLogin, getUserDetails, login } from "../store/userSlice";
export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setIsLoading(true); // Dispatch login action
      const res: any = await dispatch(getUserDetails());
      // Check login response
      if (res?.payload?.status === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    const fun = async () => {
      let success = await handleSubmit();
      console.log("success", success);
      if (success) {
        router.push("/dashboard");
      } else {
        toast.dismiss();
        toast.error("You need to Login");
        router.push("/login");
      }
    };
    fun();
  }, []);

  if (isLoading)
    return (
      <main className="flex min-h-screen items-center justify-center">
        <ReactLoading type="spin" width={40} height={40} color="#777" />
      </main>
    );

  return <main></main>;
}
