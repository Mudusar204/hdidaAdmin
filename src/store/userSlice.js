// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const getUserDetails = createAsyncThunk(
  "userSlice/getUserDetails",
  async (userId) => {
    try {
      // let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");

      console.log("function chala", userId, "token", token);
      const response = await axios.get(`${BASE_URL}/api/user/getUser`, {
        headers: {
          Authorization: token, // Correct way to set authorization header
        },
        params: {
          id: userId,
        },
      });
      return response.data;
    } catch (error) {
      // @ts-ignore
      throw new Error(error.response.data.error || "Something went wrong");
    }
  }
);

export const signup = createAsyncThunk("userSlice/signup", async (userData) => {
  try {
    console.log("function chala signup wala");
    const response = await axios.post(`${BASE_URL}/api/user/signup`, userData);
    localStorage.setItem("userId", response?.data?.data?._id);

    return response.data;
  } catch (error) {
    // @ts-ignore
    throw new Error(error.response.data.error || "Something went wrong");

    // return error.response.data;
  }
});

export const login = createAsyncThunk("userSlice/login", async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/login`, userData);
    console.log(response?.data, "response ", response?.data?.data?._id);

    if (response?.data?.data?.user?.role == "user") {
      return { status: "false", message: "You are not Admin" };
    }
    {
      response?.data?.data?._id &&
        localStorage.setItem("userId", response?.data?.data?.user?.id);
    }

    return response?.data;
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.response?.data?.error || "Something went wrong");
  }
});

export const updateUser = createAsyncThunk(
  "userSlice/update",
  async (userData) => {
    try {
      let token = localStorage.getItem("token");
      console.log("function chala", userData, "token", token);
      const response = await axios.post(
        `${BASE_URL}/api/user/update`,
        userData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(response?.data, "response ", response?.data?.data?._id);

      return response?.data;
    } catch (error) {
      // @ts-ignore
      throw new Error(error?.response?.data?.error || "Something went wrong");
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: {},
    isUserLogin: false,
  },
  reducers: {
    setUser: (state, action) => {
      console.log(action.payload, "from store");
      state.user = action.payload;
    },
    setUserLogin: (state, action) => {
      state.isUserLogin = action.payload;
    },
    deleteUser: (state, action) => {
      state.user = {};
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.user = action.payload; // Update user state with the response data
    });
  },
});

export const { setUser, deleteUser, setUserLogin } = userSlice.actions;

export default userSlice.reducer;
