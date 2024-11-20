import toast from "react-hot-toast";
import {
  createReplyAPI,
  getReplyByCommentIdAPI,
} from "../../services/commentService";
import {
  Create_Reply,
  Create_Reply_Error,
  Create_Reply_Success,
  Get_Reply,
  Get_Reply_Error,
  Get_Reply_Success,
} from "./replySlice";

export const handleGetReplyByCommentId = (commentId) => {
  return async (dispatch, getState) => {
    try {
      dispatch(Get_Reply());
      let res = await getReplyByCommentIdAPI(commentId);

      dispatch(Get_Reply_Success(res.comment));
    } catch (error) {
      dispatch(Get_Reply_Error());
      toast.error(error?.data?.message);
    }
  };
};
