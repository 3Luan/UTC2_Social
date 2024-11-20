import { createSlice } from "@reduxjs/toolkit";

export const postDetailsSlice = createSlice({
  name: "postDetails",
  initialState: {
    post: null,

    isLoading: false,
    isError: false,
  },
  reducers: {
    getPostById: (state) => {
      state.isLoading = true;
    },
    getPostByIdError: (state) => {
      state.post = null;

      state.isLoading = false;
      state.isError = true;
    },
    getPostByIdSuccess: (state, action) => {
      state.post = action.payload;

      state.isLoading = false;
      state.isError = false;
    },
  },
});

export const { getPostById, getPostByIdError, getPostByIdSuccess } =
  postDetailsSlice.actions;

export default postDetailsSlice.reducer;
