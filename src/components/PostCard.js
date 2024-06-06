import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className=" rounded w-[300px] h-[430px] shadow-lg border m-2">
      <div className="h-[300px] w-[300px] bg-gray-200">
        <img className="w-full h-auto" src={post.images[0]} alt={post.title} />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{post.title}</div>
        <p className="text-gray-700 text-base whitespace-nowrap overflow-hidden">
          {post.description}
        </p>
      </div>
      <div className="px-6 flex">
        <span className="inline-block whitespace-nowrap bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          Price: {post.price}
        </span>
        <span
          className={`inline-block  rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2`}
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
