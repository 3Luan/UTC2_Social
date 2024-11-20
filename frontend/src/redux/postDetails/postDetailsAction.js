import {
  getPostDetailByIdAPI,
  getPostUnApprovedDetailByIdAPI,
} from "../../services/postService";
import {
  getPostById,
  getPostByIdError,
  getPostByIdSuccess,
} from "./postDetailsSlice";

export const handleGetPostDetailById = (postId) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getPostById());

      let res = await getPostDetailByIdAPI(postId);

      dispatch(getPostByIdSuccess(res?.data));
    } catch (error) {
      dispatch(getPostByIdError());
    }
  };
};

export const handleGetPostUnApprovedDetail = (postId) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getPostById());

      let res = await getPostUnApprovedDetailByIdAPI(postId);

      dispatch(getPostByIdSuccess(res?.data));
    } catch (error) {
      dispatch(getPostByIdError());
    }
  };
};
