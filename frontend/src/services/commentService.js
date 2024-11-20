import backendApi from "../api/backendApi";

export const createCommentAPI = (content, postId) => {
  return backendApi.post("/api/comment/createComment", { content, postId });
};

export const createReplyAPI = (content, commentId, postId) => {
  return backendApi.post("/api/comment/createReply", {
    content,
    commentId,
    postId,
  });
};

export const getReplyByCommentIdAPI = (commentId) => {
  return backendApi.get(`/api/comment/getReplyByCommentId/${commentId}`);
};

export const deleteCommentAPI = (commentId) => {
  return backendApi.post(`/api/comment/deleteComment`, { commentId });
};

export const getCommentByPostIdAPI = (postId) => {
  return backendApi.get(`/api/comment/getCommentByPostId/${postId}`);
};

// admin
export const getDeleteCommentsAPI = (currentPage) => {
  return backendApi.get(`/api/comment/getDeleteComments/${currentPage}`);
};
