"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const RenderItem = ({ item, onPress, selected }) => {
  return (
    <div
      onClick={() => onPress(item)}
      className={` h-[150px] w-[150px] border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${
        selected ? "border-primary" : "border-gray-300"
      }`}
    >
      <div className="flex justify-center items-center mb-3">
        {item.name !== "All" ? (
          <img
            src={`https://www.hdida.app/cat/${item?.name.split(" ")[0]}.png`}
            alt={item?.name}
            className="h-16 w-16"
          />
        ) : (
          <svg
            width="64"
            height="64"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG content */}
          </svg>
        )}
      </div>
      <h3 className="text-lg font-medium text-center mb-1">
        {item?.name || item}
      </h3>
      <p className="text-sm text-center text-gray-500">{item?.description}</p>
    </div>
  );
};

const CustomModal = ({ isOpen, onClose, onSubmit }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryValues, setCategoryValues] = useState("");
  const [categoryType, setCategoryType] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: categoryName,
      values: { name: categoryName, description: categoryValues },
      type: categoryType,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Values (comma-separated)
            </label>
            <input
              type="text"
              value={categoryValues}
              onChange={(e) => setCategoryValues(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              // required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Type</label>
            <input
              type="text"
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CatList = () => {
  const [cats, setCats] = useState([]);
  const [bodyType, setBodyType] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getCat = async () => {
    try {
      toast.dismiss();
      toast.loading("Loading...");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/getCat`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data = response.data.data;
      console.log(JSON.stringify(data), "post from the backend");

      setCats(data);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to load categories");
      console.log("GetCat(): Error:", error);
    }
  };

  useEffect(() => {
    getCat();
  }, []);

  useEffect(() => {
    if (cats?.length > 0) {
      const result = cats.find((x) => x.name === "Vehicle Type");
      setSelectedVehicleType(result?.values);
      const bodies = cats.find((x) => x.name === "Body Style");
      setBodyType(bodies?.values);
    }
  }, [cats]);

  const handlePress = (item) => {
    // Uncomment and implement navigation logic if needed
    // history.push({
    //   pathname: "/search",
    //   state: { data: [{ type: "Vehicle Type", value: item }] },
    // });
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/create`,
        newCategory,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        getCat();
        setModalIsOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to create category");
      console.log("handleAddCategory(): Error:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-5 text-center">All categories</h1>
      <div className="flex justify-start gap-5 items-start flex-wrap">
        {selectedVehicleType?.map((item, index) => (
          <RenderItem key={index} item={item} onPress={handlePress} />
        ))}
        {bodyType?.map((item, index) => (
          <RenderItem key={index} item={item} onPress={handlePress} />
        ))}
      </div>
      <button
        onClick={() => setModalIsOpen(true)}
        className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-md self-center"
      >
        Add Category
      </button>

      <CustomModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
};

export default CatList;
