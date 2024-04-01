"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signup, setUserLogin } from "@/store/userSlice";
import toast from "react-hot-toast";
import Image from "next/image";
export default function AddNewUser() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [usernameError, setUsernameErr] = useState("");
  const [emailError, setEmailErr] = useState("");
  const [passwordError, setPasswordErr] = useState("");
  const [addressError, setAddressErr] = useState("");
  const [phoneError, setPhoneErr] = useState("");

  // Validation functions
  function isValidUsername(username) {
    return username.length >= 3;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    return password.length >= 8;
  }

  function isValidAddress(address) {
    return address.trim() !== "";
  }

  function isValidPhone(phone) {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  }

  // Form validation function
  const validateForm = () => {
    let valid = true;

    if (!isValidUsername(username)) {
      setUsernameErr("Username must be at least 3 characters long");
      valid = false;
    } else {
      setUsernameErr("");
    }

    if (!isValidEmail(email)) {
      setEmailErr("Email is not valid");
      valid = false;
    } else {
      setEmailErr("");
    }

    if (!isValidPassword(password)) {
      setPasswordErr("Password must be at least 8 characters long");
      valid = false;
    } else {
      setPasswordErr("");
    }

   

    if (!isValidPhone(phone)) {
      setPhoneErr("Please provide a valid phone number");
      valid = false;
    } else {
      setPhoneErr("");
    }

    return valid;
  };

  // Form submission function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        toast.loading("Adding user...");
        // @ts-ignore
        const res = await dispatch(
          signup({ name:username, email, password, phone })
        );
        if (res?.payload?.status === true) {
          toast.dismiss();
          toast.success("User added successful");
          router.push("/dashboard/users");
        } else {
          console.log(res, "res");
          throw new Error(res?.error?.message);
        }
      } catch (error) {
        toast.dismiss();
        toast.error(error?.message);
        console.error("Error occurred while adding user:", error);
      }
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <div className="flex  justify-center flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 border border-gray-200 pb-3 rounded-lg sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Add New User
              </h2>
            </div>

            <div className="mt-10">
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Enter your username"
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block px-2 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {usernameError && (
                      <p className="text-red-500 mt-1">{usernameError}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Enter your email"
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block px-2 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 mt-1">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Enter your password"
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block px-2 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="0321......"
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block px-2 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-[#1c9e7d] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add User
                    </button>
                  </div>
                </form>
               
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </>
  );
}
