import backendApi from "../api/backendApi";

export const getUsersAPI = (search) => {
  return backendApi.get(`/api/user?search=${search}`);
};

export const followUserAPI = (userId) => {
  return backendApi.post(`/api/user/followUser`, { userId });
};

export const unfollowUserAPI = (userId) => {
  return backendApi.post(`/api/user/unfollowUser`, { userId });
};

export const updateProfileAPI = (formData) => {
  return backendApi.post(`/api/user/updateProfile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUnfollowedUsersAPI = (currentPage) => {
  return backendApi.get(`/api/user/getUnfollowedUsers/${currentPage}`);
};

export const getFollowingsAPI = (currentPage) => {
  return backendApi.get(`/api/user/getFollowings/${currentPage}`);
};

export const getFollowersAPI = (currentPage) => {
  return backendApi.get(`/api/user/getFollowers/${currentPage}`);
};

export const searchUnfollowedUsersAPI = (currentPage, keyword) => {
  return backendApi.get(
    `/api/user/getUnfollowedUsers/${currentPage}/${keyword}`
  );
};

export const searchFollowingsAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/getFollowings/${currentPage}/${keyword}`);
};

export const searchFollowersAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/getFollowers/${currentPage}/${keyword}`);
};

export const getUserInfoByIdAPI = (userId) => {
  return backendApi.get(`/api/user/getUserInfoById/${userId}`);
};

export const updateCourseAPI = (courseId) => {
  return backendApi.post(`/api/user/updateCourse`, { courseId });
};

//////////////////////// Admin //////////////////////

export const getAllAdminUsersAPI = (currentPage) => {
  return backendApi.get(`/api/user/getAllAdminUsers/${currentPage}`);
};

export const getAllNonAdminUsersAPI = (currentPage) => {
  return backendApi.get(`/api/user/getAllNonAdminUsers/${currentPage}`);
};

export const searchAllAdminUsersAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/getAllAdminUsers/${currentPage}/${keyword}`);
};

export const searchAllNonAdminUsersAPI = (currentPage, keyword) => {
  return backendApi.get(
    `/api/user/getAllNonAdminUsers/${currentPage}/${keyword}`
  );
};

export const grantAdminRoleAPI = (userId) => {
  return backendApi.post(`/api/user/grantAdminRole`, { userId });
};

export const revokeAdminRoleAPI = (userId) => {
  return backendApi.post(`/api/user/revokeAdminRole`, { userId });
};

export const getUserStatisticsAPI = () => {
  return backendApi.get(`/api/user/getUserStatistics`);
};

export const getUserIsBanStatisticsAPI = () => {
  return backendApi.get(`/api/user/getUserIsBanStatistics`);
};

export const getUserNotBanStatisticsAPI = () => {
  return backendApi.get(`/api/user/getUserNotBanStatistics`);
};

export const banUserAPI = (userId) => {
  return backendApi.post(`/api/user/banUser`, { userId });
};

export const unbanUserAPI = (userId) => {
  return backendApi.post(`/api/user/unbanUser`, { userId });
};

export const getBanUsersAPI = (currentPage) => {
  return backendApi.get(`/api/user/getBanUsers/${currentPage}`);
};

export const searchBanUsersAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/user/getBanUsers/${currentPage}/${keyword}`);
};

export const getNewUserStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/user/getNewUserStatistics/${day}/${month}/${year}`
  );
};
