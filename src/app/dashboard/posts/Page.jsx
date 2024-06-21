"use client";
import React, { useState, useEffect } from "react";
import PostCard from "../../../components/PostCard";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// Mock data, replace with actual data fetching
const mockPosts = [
  {
    title: "Sample Post",
    images: ["https://via.placeholder.com/150"],
    description: "This is a sample post",
    price: 100,
    status: "active",
  },
  // Add more posts as needed for demonstration
];

const Page = () => {
  const [posts, setPosts] = useState([]);

  const getAllPosts = async () => {
    try {
      toast.dismiss();
      toast.loading("Loading...");
      const token = await localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/post/getAll",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
      toast.dismiss();
      setPosts(response?.data?.data);
    } catch (error) {
      toast.dismiss();

      toast.error(error?.message);
      console.log(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      toast.loading("Deleting post...");
      console.log(postId, "postId");
      const token = await localStorage.getItem("token");
      const response = await axios.delete(
        "http://localhost:5000/api/post/delete",
        {
          data: {
            postId: postId,
          },
          headers: {
            Authorization: token,
          },
        }
      );
      toast.dismiss();
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.dismiss();
      toast.error(error?.message);
      console.log(error);
    }
  };
  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="p-4 w-full h-full overflow-y-scroll">
      <h1 className="text-2xl font-bold text-center mb-4">Users Posts</h1>
      <div className="flex flex-wrap justify-center">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} deletePost={deletePost} />
        ))}
      </div>
    </div>
  );
};

export default Page;
