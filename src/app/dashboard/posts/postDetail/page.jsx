"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import PostDetailComponent from "../../../../components/PostDetail";
const PostDetailScreen = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("post_id");
  const [postDetail, setPostDetail] = useState(null);

  const getPostDetail = async () => {
    try {
      toast.dismiss();
      toast.loading("Loading...");
      const token = await localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/post/getById",
        {
          headers: {
            Authorization: token,
          },
          params: {
            id: postId,
          },
        }
      );
      console.log(
        JSON.stringify(response?.data?.data),
        "post form the backend"
      );
      toast.dismiss();
      setPostDetail(response?.data?.data);
    } catch (error) {
      toast.dismiss();

      toast.error(error?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getPostDetail();
  }, [postId]);
  return (
    <div className="w-full">
      {postDetail && <PostDetailComponent post={postDetail} />}
    </div>
  );
};

export default PostDetailScreen;
