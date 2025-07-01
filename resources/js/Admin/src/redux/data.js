import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import HttpRequest from "../repositories";
import _ from "lodash";
import Helper from "../helpers";
import axios from "axios";

const initialState = {};

// Generates pending, fulfilled and rejected action types
const request = createAsyncThunk(
  "data/request",
  async ({ headers, payload }, { rejectWithValue }) => {
    try {
      let { url, method } = headers;
      let request_data = HttpRequest.getRequestData(method, url, payload);
      const response = await axios(request_data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const requestSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    removeFlashMessage: (state, action) => {
      state[action.payload].flashMessage = <></>;
    },
    removeElement: (state, action) => {
      let { key, id } = action.payload;
      state[key].data = state[key].data.filter((item) => item.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(request.pending, (state, action) => {
      let { key } = action.meta.arg.headers;
      state[key] = {};
      state[key].isLoading = true;
    });
    builder.addCase(request.fulfilled, (state, action) => {
      let { key, method } = action.meta.arg.headers;
      key = _.cloneDeep(key);
      if (method !== 'GET') {
        Helper.sendNotification("success", "Success", action.payload.message);
      }
      state[key].isLoading = false;
      state[key].data = action.payload.data;
      state[key].message = action.payload.message;
      state[key].code = action.payload.code;
      state[key].pagination = action.payload.pagination;
    });
    builder.addCase(request.rejected, (state, action) => {
      if (action?.payload?.code == 401) {
        state = null;
        Helper.sweetAlert(
          "error",
          "Success",
          "Your session has been expired. Kindly login to continue.",
          () => Helper.removeStorageData()
        );
      }
      if (action.payload.data) {
        Object.entries(action.payload.data).forEach(([key, value]) => {
          Helper.sendNotification("error", action.payload.message, value);
        });
      } else {
        Helper.sendNotification("error", action.payload.message);
      }
      let { key } = action.meta.arg.headers;
      key = _.cloneDeep(key);
      state[key].isLoading = false;
      state[key].data = action.payload.data;
      state[key].message = action.payload.message;
      state[key].code = action.payload.code;
    });
  },
});

export default requestSlice.reducer;
export const { removeFlashMessage, removeElement } = requestSlice.actions;
export { request };
