"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login, setUserLogin } from "../../store/userSlice";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailErr] = useState("");
  const [passwordError, setPasswordErr] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneErr] = useState("");

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    return password.length >= 8;
  }

  function isValidPhone(phone) {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  }
  const validateForm = () => {
    let valid = true;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        toast.loading("User login");
        // Dispatch login action
        const res = await dispatch(login({ email, phone, password }));
        // Check login response
        if (res.payload.status === true) {
          // Set user login state
          toast.dismiss();
          toast.success("login sucess");
          dispatch(setUserLogin(true));
          console.log(res?.payload?.data, "res");
          await localStorage.setItem("role", res?.payload?.data?.user?.role);
          await localStorage.setItem("userId", res?.payload?.data?.user?.id);
          await localStorage.setItem("token", res?.payload?.data?.user?.token);
          // Redirect to homepage
          if (res?.payload?.data?.user?.role === "user") {
            // router.push("/");
          } else {
            // router.push("/adminDashboard");
          }
        } else {
          throw new Error("Login failed");
        }
      } catch (error) {
        console.error("Error occurred while logging in:", error);
        toast.dismiss();
        toast.error("invalid credentials");
      }
    }
  };

  return (
    <div>
      <div className="flex min-h-screen  flex-1">
        <div className="flex mt-[5%] h-full flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10">
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="email"
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
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="password"
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm leading-6 text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    {/* <div className="text-sm leading-6">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div> */}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
                <div className="text-center mt-2">
                  create new account{" "}
                  <a className="text-blue-500" href="/signup">
                    Signup
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
          {/* <Image
           
            className="absolute inset-0 h-full w-full object-cover"
            src={require("../../assets/images/cleaningImg.jpeg")}
            alt="img"
          /> */}
        </div>
      </div>
    </div>
  );
}
