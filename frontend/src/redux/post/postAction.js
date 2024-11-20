import toast from "react-hot-toast";
import {
  getHistoryPostsAPI,
  getPostsAPI,
  getUnapprovedPostsAPI,
  toggleLikePostAPI,
} from "../../services/postService";
import { getPost, getPostError, getPostSuccess } from "./postSlice";

export const handleGetPosts = (currentPage) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getPost());

      let res = await getPostsAPI(currentPage);

      dispatch(getPostSuccess(res?.data));
    } catch (error) {
      dispatch(getPostError());
    }
  };
};

export const handleGetUnapprovedPosts = (currentPage) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getPost());

      let res = await getUnapprovedPostsAPI(currentPage);

      dispatch(getPostSuccess(res?.data));
    } catch (error) {
      dispatch(getPostError());
    }
  };
};

export const handlegetHistoryPosts = (currentPage) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getPost());

      let res = await getHistoryPostsAPI(currentPage);

      dispatch(getPostSuccess(res?.data));
    } catch (error) {
      dispatch(getPostError());
    }
  };
};
