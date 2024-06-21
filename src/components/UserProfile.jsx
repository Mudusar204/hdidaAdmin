import React from "react";

const UserProfileComponent = ({ user }) => {
  return (
    <div className="max-w-xl mx-auto my-8 p-4 shadow-lg rounded-lg border">
      <div className="flex flex-col items-center mb-6">
        <img
          className="w-32 h-32 rounded-full mb-4"
          src={user.profileImage}
          alt={user.name}
        />
        <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
      </div>
      <h2 className="text-2xl font-bold mb-4">Bio</h2>
      <div className="flex justify-between mb-4">
        {user?.phone && (
          <p className="text-gray-700 flex-1">
            <strong>Phone:</strong> {user?.phone}
          </p>
        )}

        {user?.email && (
          <p className="text-gray-700 flex-1">
            <strong>Email:</strong> {user?.email}
          </p>
        )}
        {user?.gender && (
          <p className="text-gray-700 flex-1">
            <strong>Gender:</strong> {user?.gender}
          </p>
        )}
      </div>
      <div className="mb-6">
        <div className="flex ">
          <p className="text-gray-700 flex-1">
            <strong>Followers:</strong> {user?.followerCount}
          </p>
          <p className="text-gray-700 flex-1">
            <strong>Following:</strong> {user?.followingCount}
          </p>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Address</h2>
        <p className="text-gray-700">
          <strong>City:</strong> {user?.address?.city}
        </p>
        <p className="text-gray-700">
          <strong>Country:</strong> {user?.address?.country}
        </p>
        <p className="text-gray-700">
          <strong>Address:</strong> {user?.address?.addressDetail}
        </p>
      </div>
    </div>
  );
};

export default UserProfileComponent;
