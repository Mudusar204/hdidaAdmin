import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

export const getAllUser = createAsyncThunk(
  "adminSlice/getAllUser",
  async () => {
    try {
      let userId = await localStorage.getItem("userId");

      console.log("get all user function called", userId);
      const response = await axios.post("/api/admin/getAllUser", {
        userId: userId,
      });
      return response.data;
    } catch (error) {
      // @ts-ignore
      throw new Error(error.response.data.error || "Something went wrong");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "adminSlice/deleteUser",
  async (userId) => {
    try {
      console.log(userId, "user id in store");
      const response = await axios.post("/api/admin/deleteUser", {
        userId: userId,
      });
      return response.data;
    } catch (error) {
      // @ts-ignore
      throw new Error(error.response.data.error || "Something went wrong");
    }
  }
);

export const blockUnBlockUser = createAsyncThunk(
  "adminSlice/blockUnBlockUser",
  async (userId) => {
    try {
      console.log(userId, "user id in store");
      const response = await axios.post("/api/admin/blockUnBlockUser", {
        userId: userId,
      });
      return response.data;
    } catch (error) {
      // @ts-ignore
      throw new Error(error.response.data.error || "Something went wrong");
    }
  }
);



export const getTodayCleanings = createAsyncThunk(
  "adminSlice/getTodayCleanings",
  async () => {
    try {
      let userId = await localStorage.getItem("userId");

      console.log("get today cleanings", userId);
      const response = await axios.post("/api/admin/getTodayCleanings", {
        userId: userId,
      });
      return response.data;
    } catch (error) {
      // @ts-ignore
      throw new Error(error.response.data.error || "Something went wrong");
    }
  }
);


export const getTomorrowCleanings = createAsyncThunk(
  "adminSlice/getTomorrowCleanings",
  async () => {
    try {
      let userId = await localStorage.getItem("userId");

      console.log("get today cleanings", userId);
      const response = await axios.post("/api/admin/getTomorrowCleanings", {
        userId: userId,
      });
      return response.data;
    } catch (error) {
      // @ts-ignore
      throw new Error(error.response.data.error || "Something went wrong");
    }
  }
);

export const getAllPayments = createAsyncThunk("userSlice/getAllPayments", async () => {
  try {
    const userId=await localStorage.getItem("userId")
    console.log("function get payments", userId);
    const response = await axios.post("/api/payments/getAllPayments", {userId:userId});
    console.log(response, "response ");

    return response;
  } catch (error) {
    console.log(error,"===========");
    // @ts-ignore
    throw new Error(error.response.data.error || "Something went wrong");
  }
});

const adminSlice = createSlice({
  name: "adminSlice",
  initialState: {
    users: [],
  },
  reducers: {
    setAllUser: (state, action) => {
      console.log(action.payload, "from store");
      state.users = action.payload;
    },
  },
});

export const { setAllUser } = adminSlice.actions;

export default adminSlice.reducer;
