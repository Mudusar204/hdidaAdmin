"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Delete, DeleteIcon, Trash2 } from "lucide-react";

const RenderItem = ({ item, onPress, selected, subCategories , handleDeleteCategory}) => {
  return (
    <div
      onClick={() => onPress(item)}
      className="border-t-2 border-gray-300  p-2  my-5"
    >
<div className="flex justify-between items-center">

      <h3 className="text-lg font-medium text-center mb-1">
        {item?.name || item}
      </h3>
      <Trash2  onClick={() => handleDeleteCategory(item?._id)} className="cursor-pointer text-red-600" />
</div>
      {/* <p className="text-sm text-center text-gray-500">{item?.description}</p> */}
      {subCategories?.length > 0 && (
        <ul className="flex flex-wrap justify-start items-center gap-3 text-sm text-center  mt-2">
          {subCategories.map((subItem, index) => (
            <div className={` border rounded-lg shadow-md p-2 cursor-pointer transition-transform transform hover:scale-105 ${selected ? "border-primary" : "border-gray-300"
              }`}>
              {(item?.name == "Vehicle Type" || item?.name=="Body Style") && (
                <img 
                  src={`https://www.hdida.app/cat/${subItem?.name.split(" ")[0]}.png`}
                  alt={subItem?.name}
                  className="h-[100px] w-[100px]"
                />

              )}
              <li key={index}>{subItem?.name}</li>
            </div>
          ))}
        </ul>
      )}
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
      values: categoryValues.split(",").map((value) =>({name:value.trim()}) ),
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

  const handlePress = (item) => {
    // Uncomment and implement navigation logic if needed
    // history.push({
    //   pathname: "/search",
    //   state: { data: [{ type: "Vehicle Type", value: item }] },
    // });
  };

  const handleAddCategory = async (newCategory) => {
    try {
      toast.dismiss();
      toast.loading("Adding Category...");
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
  const handleDeleteCategory = async (categoryId) => {
    try {
      console.log(categoryId);
    if( ! window.confirm("Are you sure you want to delete this category?")){
      return;
    }
    
      toast.dismiss();
      toast.loading("deleting Category...");
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/deleteCat`,
        {
          headers: {
            Authorization: token,
          },
          data: {
            id: categoryId,
          },
        }
      );
      

      if (response.data.status) {
        toast.success(response.data.message);
        getCat();
        // setModalIsOpen(false);
      } else {
      toast.dismiss();

        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();

      toast.error("Failed to delete category");
      console.log("handleAddCategory(): Error:", error);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-2xl font-bold mb-5 text-center">All categories</h1>
      <div className=" justify-start gap-5 items-start flex-wrap">
        {cats.map((category, index) => (
          <RenderItem
            key={index}
            item={category}
            onPress={handlePress}
            subCategories={category.values}
            handleDeleteCategory={handleDeleteCategory}
          />
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
