import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

const PostDetailComponent = ({ post, deletePost }) => {
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    console.log("Delete icon clicked, propagation stopped");
    deletePost(post._id);
  };
  return (
    <div className="w-[100%]  mb-8 p-4 ">
      {/* <div className="flex flex-col md:flex-row mb-6"> */}
      <div className="w-full h-[70vh] bg-gray-200">
        <img
          className="w-full h-full rounded-md object-contain"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${post?.images[0]}`}
          alt={post?.title}
        />
      </div>

      <div className="w-full  flex justify-between items-center gap-10 ">
        <h1 className="text-3xl font-bold my-4">{post.title}</h1>
        <Trash2
          onClick={handleDeleteClick}
          className="text-red-500 ml-3 cursor-pointer mr-6"
        />
      </div>
      <div className="w-full  flex justify-between gap-10 ">
        <p className="text-gray-700 mb-2">
          <strong>Description:</strong> {post.description}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Price:</strong> {post.price}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 ml-1 rounded-md py-1 text-sm font-semibold text-gray-700 mr-2 ${
              post?.status === "active" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {post.status}
          </span>
        </p>
      </div>
      <div className="w-full  flex justify-start gap-10 my-5">
        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {post.location.city},{" "}
          {post.location.country}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Address:</strong> {post.location.addressDetail}
        </p>
      </div>
      {/* </div> */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Details</h2>
        <ul>
          {post.info.map((item) => (
            <li key={item._id} className="mb-2">
              <span className="font-semibold">{item.label}:</span> {item.value}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul>
          {post.features.map((feature, index) => (
            <li key={index} className="mb-2">
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Boost Information</h2>
        <p className="text-gray-700 mb-2">
          <strong>Is Boosted:</strong> {post.boost.isBoosted ? "Yes" : "No"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Boost Date:</strong>{" "}
          {new Date(post.boost.boostDate).toLocaleString()}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Boost Till:</strong> {post.boost.boostTill}
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Author</h2>
        <div className="flex items-center">
          <img
            className="w-16 h-16 rounded-full mr-4"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL} / ${post?.author?.profileImage}`}
            alt={post?.author?.name}
          />
          <div>
            <p className="text-gray-700">
              <strong>Name:</strong> {post?.author?.name}
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> {post?.author?.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailComponent;
