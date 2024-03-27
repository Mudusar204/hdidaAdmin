// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const getUserDetails = createAsyncThunk(
  "userSlice/getUserDetails",
  async () => {
    try {
      let userId = await localStorage.getItem("userId");
      let token = await localStorage.getItem("token");

      console.log("function chala", userId,"token",token);
      const response = await axios.get(
        `${BASE_URL}/api/user/getUser`,
        {
        
          headers: {
            Authorization:token, // Correct way to set authorization header
          },
          // params: {
          //   id: userId,
          // }
          }
      );
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
    localStorage.setItem("userId", response.data.data._id);

    return response.data;
  } catch (error) {
    // @ts-ignore
    throw new Error(error.response.data.error || "Something went wrong");

    // return error.response.data;
  }
});

export const login = createAsyncThunk("userSlice/login", async (userData) => {
  try {
    console.log("function chala login wala ");
    const response = await axios.post(`${BASE_URL}/api/user/login`, userData);
    console.log(response.data, "response ");
    localStorage.setItem("userId", response.data.data._id);

    return response.data;
  } catch (error) {
    // @ts-ignore
    throw new Error(error.response.data.error || "Something went wrong");
  }
});


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
