import React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ImageSlider from "./ImageSlider";
const PostCard = ({ post }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/posts/postDetail?post_id=${post._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer rounded w-[300px] h-[350px] shadow-lg border m-2"
    >
      <div className="h-[200px] w-[300px] bg-gray-200">
        <ImageSlider images={post?.images} height={"200px"} width={"300px"} />

        {/* <img
          className="w-[300px] h-[200px]"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${post?.images[0]}`}
          alt={post?.title}
        /> */}
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl my-2 flex justify-between">
          <p className="whitespace-nowrap overflow-hidden">{post.title}</p>
        </div>
        <p className="text-gray-700 text-base whitespace-nowrap overflow-hidden">
          {post.description}
        </p>
      </div>
      <div className="px-6 flex">
        <span className="inline-block whitespace-nowrap bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          Price: {post.price}
        </span>
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2`}
        >
          Status:
          <span
            className={`px-2 ml-1 rounded-md py-1 text-sm font-semibold text-gray-700 mr-2 ${
              post?.status === "active" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {post.status}
          </span>
        </span>
      </div>
    </div>
  );
};

export default PostCard;
