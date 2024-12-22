import backendApi from "../api/backendApi";

export const createPostAPI = (formData) => {
  return backendApi.post(`/api/post/createPost`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePostAPI = (formData) => {
  return backendApi.post(`/api/post/updatePost`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getPostsAPI = (currentPage) => {
  return backendApi.get(`/api/post/getPosts/${currentPage}`);
};

export const searchPostAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/post/getPosts/${currentPage}/${keyword}`);
};

export const getHistoryPostsAPI = (currentPage) => {
  return backendApi.get(`/api/post/getHistoryPosts/${currentPage}`);
};

export const searchHistoryPostAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/post/getHistoryPosts/${currentPage}/${keyword}`);
};

export const getUnapprovedPostsAPI = (currentPage) => {
  return backendApi.get(`/api/post/getUnapprovedPosts/${currentPage}`);
};

export const searchUnapprovedPostAPI = (currentPage, keyword) => {
  return backendApi.get(
    `/api/post/getUnapprovedPosts/${currentPage}/${keyword}`
  );
};

export const getPostDetailByIdAPI = (postId) => {
  return backendApi.get(`/api/post/getPostDetailById/${postId}`);
};

export const getPostUnApprovedDetailByIdAPI = (postId) => {
  return backendApi.get(`/api/post/getPostUnApprovedDetailById/${postId}`);
};

export const toggleLikePostAPI = (postId) => {
  return backendApi.post(`/api/post/toggleLikePost`, { postId });
};

export const approvedPostAPI = (postId) => {
  return backendApi.post(`/api/post/approvedPost`, { postId });
};

export const deletePosttAPI = (postId) => {
  return backendApi.post(`/api/post/deletePost`, { postId });
};

export const searchPostSavedAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/post/getSavedPosts/${currentPage}/${keyword}`);
};

export const getSavePostsdAPI = (currentPage) => {
  return backendApi.get(`/api/post/getSavedPosts/${currentPage}`);
};

export const savePostdAPI = (postId) => {
  return backendApi.post(`/api/post/savePost`, { postId });
};

export const UnsavePostdAPI = (postId) => {
  return backendApi.post(`/api/post/UnsavePost`, { postId });
};

export const getSavedPostIdAPI = () => {
  return backendApi.get(`/api/post/getSavedPostId`);
};

//////////////////////// Admin //////////////////////

export const getDeletePostsAPI = (currentPage) => {
  return backendApi.get(`/api/post/getDeletePosts/${currentPage}`);
};

export const getPostsStatisticsAPI = (day, month, year) => {
  return backendApi.get(`/api/post/getPostsStatistics/${day}/${month}/${year}`);
};

export const getUnapprovedPostsStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/post/getUnapprovedPostsStatistics/${day}/${month}/${year}`
  );
};

export const getapprovedPostsStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/post/getapprovedPostsStatistics/${day}/${month}/${year}`
  );
};

export const getPostDeleteDetailByIdAPI = (postId) => {
  return backendApi.get(`/api/post/getPostDeleteDetailById/${postId}`);
};
