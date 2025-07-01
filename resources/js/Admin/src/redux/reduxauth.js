import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import axios from "axios";
import HttpRequest from "../repositories";
import Helper from "../helpers";
import api from "../repositories/api";

const initialState = {
  loading: false,
  data: Helper.getStorageData("session") ? Helper.getStorageData("session") : {},
  code: "",
};
console.log('yess=======================>>>>')
// Generates pending, fulfilled and rejected action types
const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      let { url, method } = api.login;
      let request_data = HttpRequest.getRequestData(method, url, {
        ...payload,
        device_type: "web",
        device_token: "12345",
      });
      const response = await axios(request_data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateSession: (state, action) => {
      Helper.setStorageData("session", JSON.stringify(action.payload));
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login handlers
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      Helper.setStorageData(
        "session",
        JSON.stringify(action.payload.data)
        );
      let { navigate } = action.meta.arg;
      Helper.sendNotification("success", "Success", action.payload.message);
      state.loading = false;
      state.data = action.payload.data;
      state.code = action.payload.code;
      state.message = action.payload.message;
      navigate('/admin/dashboard');
    });
    builder.addCase(login.rejected, (state, action) => {
      
      if (action.payload.data) {
        Object.entries(action.payload.data).forEach(([key, value]) => {
          Helper.sendNotification("error", action.payload.message, value);
        });
      } else {
        Helper.sendNotification("error", action.payload.message);
      }
      state.loading = false;
      state.data = action.payload.data;
      state.code = action.payload.code;
    });
  },
});

export default authSlice.reducer;
export const { updateSession } = authSlice.actions;
export { login };
