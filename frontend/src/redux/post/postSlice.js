import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    count: 0,
    isLoading: false,
    isError: false,
  },
  reducers: {
    getPost: (state) => {
      state.posts = [];
      state.isLoading = true;
    },
    getPostError: (state) => {
      state.posts = [];
      state.count = 0;

      state.isLoading = false;
      state.isError = true;
    },
    getPostSuccess: (state, action) => {
      state.posts = action.payload.posts;
      state.count = action.payload.count;

      state.isLoading = false;
      state.isError = false;
    },
  },
});

export const { getPost, getPostError, getPostSuccess } = postSlice.actions;

export default postSlice.reducer;
