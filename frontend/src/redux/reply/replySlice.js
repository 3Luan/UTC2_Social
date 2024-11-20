import { createSlice } from "@reduxjs/toolkit";

export const replySlice = createSlice({
  name: "reply",
  initialState: {
    data: null,
    isLoading: false,
  },
  reducers: {
    Get_Reply: (state) => {
      state.data = null;

      state.isLoading = true;
    },
    Get_Reply_Error: (state) => {
      state.data = null;

      state.isLoading = false;
      state.isError = true;
    },
    Get_Reply_Success: (state, action) => {
      state.data = action.payload;

      state.isLoading = false;
      state.isError = false;
    },
  },
});

export const { Get_Reply, Get_Reply_Error, Get_Reply_Success } =
  replySlice.actions;

export default replySlice.reducer;
