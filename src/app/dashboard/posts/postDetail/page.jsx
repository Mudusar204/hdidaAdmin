"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Suspense } from "react";
import PostDetailComponent from "../../../../components/PostDetail";
const PostDetailScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("post_id");
  const [postDetail, setPostDetail] = useState(null);

  const getPostDetail = async () => {
    try {
      toast.dismiss();
      toast.loading("Loading...");
      const token = await localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/getById`,
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
  const deletePost = async (postId) => {
    try {
      toast.dismiss(); // Clear any existing toasts
      toast.loading("Deleting post...");
      console.log(postId, "postId");

      const token = localStorage.getItem("token");
      if (!token) {
        toast.dismiss();
        toast.error("No token found, please login again");
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/delete`,
        {
          data: { postId },
          headers: { Authorization: token },
        }
      );

      console.log(response, "response");
      toast.dismiss();

      if (response.data?.status === false) {
        toast.error(response.data?.message || "Failed to delete the post");
      } else {
        toast.success("Post deleted successfully");
        router.push(`/dashboard/posts`);
      }
    } catch (error) {
      toast.dismiss();
      if (error.response) {
        // Server responded with a status other than 2xx
        toast.error(
          error.response.data?.message || "Failed to delete the post"
        );
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server, please try again");
      } else {
        // Something else happened while setting up the request
        toast.error(error.message || "An error occurred, please try again");
      }
      console.log(error);
    }
  };


  const updatePost = async (postId) => {
    try {
      console.log(postId, "postId");

      router.push(`/dashboard/posts/updatePost?post_id=${postId}`);

      
    } catch (error) {
     
    }
  };

  useEffect(() => {
    getPostDetail();
  }, [postId]);
  return (
    <div className="w-full">
      <Suspense>
        {postDetail && (
          <PostDetailComponent post={postDetail} deletePost={deletePost} updatePost={updatePost}/>
        )}
      </Suspense>
    </div>
  );
};

export default PostDetailScreen;
