"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Suspense } from "react";
import UserProfileComponent from "../../../../components/UserProfile";
const UserProfileScreen = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const [userProfile, setUserProfile] = useState(null);

  const getUserProfile = async () => {
    try {
      toast.dismiss();
      toast.loading("Loading...");
      const token = await localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUser`,
        {
          headers: {
            Authorization: token,
          },
          params: {
            id: userId,
          },
        }
      );
      console.log(
        JSON.stringify(response?.data?.data),
        "post form the backend"
      );
      toast.dismiss();
      setUserProfile(response?.data?.data?.user);
    } catch (error) {
      toast.dismiss();

      toast.error(error?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [userId]);
  return (
    <div className="w-full">
      <Suspense>
        {userProfile && <UserProfileComponent user={userProfile} />}
      </Suspense>
    </div>
  );
};

export default UserProfileScreen;
