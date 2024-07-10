"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import axios from 'axios';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { features } from 'process';


 const savedFeatures = [
  {name: 'Air Conditioning'},
  {name: 'Power Windows'},
  {name: 'Power Door Locks'},
  {name: 'Power Mirrors'},
  {name: 'Cruise Control'},
  {name: 'Bluetooth Connectivity'},
  {name: 'USB Ports'},
  {name: 'Backup Camera'},
  {name: 'Keyless Entry'},
  {name: 'Remote Start'},
  {name: 'Sunroof/Moonroof'},
  {name: 'Alloy Wheels'},
  {name: 'Fog Lights'},
  {name: 'Traction Control'},
  {name: 'Stability Control'},
  {name: 'Anti-lock Braking System (ABS)'},
  {name: 'Tire Pressure Monitoring System (TPMS)'},
  {name: 'Heated Seats'},
  {name: 'Leather Seats'},
  {name: 'Satellite Radio'},
  {name: 'Navigation System'},
  {name: 'Automatic Transmission'},
  {name: 'Manual Transmission'},
  {name: 'Four-wheel drive (4WD)'},
  {name: 'All-wheel drive (AWD)'},
  {name: 'Heated Steering Wheel'},
  {name: 'Adaptive Cruise Control'},
  {name: 'Lane Departure Warning'},
  {name: 'Blind Spot Monitoring'},
  {name: 'Parking Sensors'},
  {name: 'Hands-Free Liftgate'},
  {name: 'Voice Control'},
  {name: 'Head-Up Display'},
  {name: 'LED Headlights'},
  {name: 'Roof Rails'},
  {name: 'Trailer Hitch'},
  {name: 'Sport Suspension'},
  {name: 'Off-Road Package'},
];   



const UpdatePost = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("post_id");

  const [post, setPost] = useState({
    title: '',
    description: '',
    price: 0,
    fixedPrice: false,
    features: [],
    images: [],
    location: { addressDetail: '', coordinates: [], city: '', country: '' },
    info: []
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [selectedSubCategories, setSelectedSubCategories] = useState({});

  useEffect(() => {
    fetchPost();
    getCat();
  }, [postId]);

  useEffect(() => {
    if (post.info.length > 0 && categories.length > 0) {
      const initialSelectedCategories = {};
      const initialSubCategories = {};
      const initialSelectedSubCategories = {};

      post.info.forEach(category => {
        const categoryData = categories.find(cat => cat.name === category.label);
        if (categoryData) {
          initialSelectedCategories[category.label] = { value: category.value, label: category.value, subCategories: categoryData.subCategories };
          initialSubCategories[category.label] = categoryData.subCategories || [];

          if (category.subValue) {
            initialSelectedSubCategories[category.label] = { value: category.subValue, label: category.subValue };
          }
        }
      });

      setSelectedCategories(initialSelectedCategories);
      setSubCategories(initialSubCategories);
      setSelectedSubCategories(initialSelectedSubCategories);
    }
  }, [post.info, categories]);

  const fetchPost = async () => {
    try {
      toast.dismiss();
      toast.loading("Fetching post...");

      const token = localStorage.getItem("token");
      if (!token) {
        toast.dismiss();
        toast.error("No token found, please login again");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/getById`,
        {
          headers: { Authorization: token },
          params: { id: postId }
        }
      );

      toast.dismiss();

      if (response.data?.status === false) {
        toast.error(response.data?.message || "Failed to fetch the post");
      } else {
        toast.success("Post fetched successfully");
        setPost(response.data?.data);
      }
    } catch (error) {
      toast.dismiss();
      if (error.response) {
        toast.error(
          error.response.data?.message || "Failed to fetch the post"
        );
      } else if (error.request) {
        toast.error("No response from server, please try again");
      } else {
        toast.error(error.message || "An error occurred, please try again");
      }
      console.log(error);
    }
  };

  const getCat = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/getCat`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      if (response.data.status) {
        setCategories(response.data.data);
      } else {
        window.alert('Error', response.data.message);
      }
    } catch (err) {
      console.log('GetCat() : Error :', err);
      setLoading(false);
    }
  };

  const handleCategoryChange = (category, selectedOption) => {
    setSelectedCategories({
      ...selectedCategories,
      [category]: selectedOption
    });
    setSubCategories({
      ...subCategories,
      [category]: selectedOption.subCategories || []
    });
    setSelectedSubCategories({
      ...selectedSubCategories,
      [category]: null
    });
  };

  const handleSubCategoryChange = (category, selectedOption) => {
    setSelectedSubCategories({
      ...selectedSubCategories,
      [category]: selectedOption
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    setPost((prevPost) => ({
      ...prevPost,
      fixedPrice: !prevPost.fixedPrice,
    }));
  };

  const handleFeaturesChange = (selectedOptions) => {
    const features = selectedOptions.map(option => option.value);
    setPost((prevPost) => ({
      ...prevPost,
      features,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
 
    console.log(files.length,"file", files,"--------------------------------");
    setPost((prevPost) => ({
      ...prevPost,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    toast.loading("Updating post...");
    const infoArray = Object.keys(selectedCategories).map(category => {
      const subValue = selectedSubCategories[category]?.value || '';
      return { label: category, value: selectedCategories[category].value, subValue: subValue };
    });

    const data = {
      id: postId,
      title: post.title,
      description: post.description,
      price: post.price,
      fixedPrice: post.fixedPrice,
      location: {
        coordinates: post.location.coordinates,
        city: post.location.city,
        country: post.location.country,
        addressDetail: post.location.addressDetail,
      },
      features: post.features,
      info: JSON.stringify(infoArray),
      images: post.images,
    };

    const token = localStorage.getItem("token");
console.log(data.images,"--------------------------------");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/update`,
        data,
        {
          headers: { Authorization: token }
        }
      );
      if (response.data.status) {
        toast.success("Post updated successfully");
        router.push(`/dashboard/posts/postDetail?post_id=${postId}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update post");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   toast.loading("Updating post...");

//   const infoArray = Object.keys(selectedCategories).map(category => {
//     const subValue = selectedSubCategories[category]?.value || '';
//     return { label: category, value: selectedCategories[category].value, subValue: subValue };
//   });

//   const formData = new FormData();
//   formData.append('id', postId);
//   formData.append('title', post.title);
//   formData.append('description', post.description);
//   formData.append('price', post.price);
//   formData.append('fixedPrice', post.fixedPrice);
//   formData.append('location[coordinates]', JSON.stringify(post.location.coordinates));
//   formData.append('location[city]', post.location.city);
//   formData.append('location[country]', post.location.country);
//   formData.append('location[addressDetail]', post.location.addressDetail);
//   formData.append('features', JSON.stringify(post.features));
//   formData.append('info', JSON.stringify(infoArray));

//   Array.from(post.images).forEach((image, index) => {
//     formData.append(`images`, image);
//   });

//   const token = localStorage.getItem("token");

//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/update`,
//       formData,
//       {
//         headers: {
//           'Authorization': token,
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );

//     if (response.data.status) {
//       toast.success("Post updated successfully");
//       router.push(`/dashboard/posts/postDetail?post_id=${postId}`);
//     } else {
//       toast.error(response.data.message);
//     }
//   } catch (error) {
//     toast.error("Failed to update post");
//     console.log(error);
//   } finally {
//     setLoading(false);
//   }
// };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Post</h2>
      {loading ? (
        <div className='w-4 h-4 animate-spin border-red-100 border-2 ' />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={post.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={post.price}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Is Price Fixed?
            </label>
            <input
              type="checkbox"
              checked={post.fixedPrice}
              onChange={handleToggle}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>

          {categories.map(category => (
            <div key={category.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {category.name}
              </label>
              {category.type === "dropdown" ? (
                <>
                  <Select
                    value={selectedCategories[category.name] || null}
                    onChange={(option) => handleCategoryChange(category.name, option)}
                    options={category.values.map(value => ({ value: value.name, label: value.name, subCategories: value.subCategories }))}
                    className="mt-1 block w-full"
                    placeholder={`Select ${category.name}`}
                  />
                  {selectedCategories[category.name] && subCategories[category.name] && subCategories[category.name].length > 0 && (
                    <Select
                      value={selectedSubCategories[category.name] || null}
                      onChange={(option) => handleSubCategoryChange(category.name, option)}
                      options={subCategories[category.name].map(subCategory => ({ value: subCategory, label: subCategory }))}
                      className="mt-1 block w-full"
                      placeholder={`Select Subcategory of ${category.name}`}
                    />
                  )}
                </>
              ) : (
                <input
                  type="text"
                  name={category.name}
                  value={selectedCategories[category.name]?.value || ""}
                  onChange={(e) => handleCategoryChange(category.name, { value: e.target.value, label: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={`Enter ${category.name}`}
                />
              )}
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Features
            </label>
            <Select
              isMulti
              value={post.features.map(feature => ({ value: feature, label: feature }))}
              onChange={handleFeaturesChange}
              options={savedFeatures.map(feature => ({ value: feature.name, label: feature.name }))}
              className="mt-1 block w-full"
              placeholder="Select features"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={post.location.addressDetail}
              onChange={e => setPost({ ...post, location: { ...post.location, addressDetail: e.target.value } })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Coordinates
            </label>
            <input
              type="text"
              name="coordinates"
              value={post.location.coordinates.join(', ')}
              onChange={e => setPost({ ...post, location: { ...post.location, coordinates: e.target.value.split(', ') } })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdatePost;
