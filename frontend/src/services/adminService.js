import backendApi from "../api/backendApi";

export const loginAPI = (username, password) => {
  return backendApi.post("/api/adminManager/login", { username, password });
};

export const refreshAPI = () => {
  return backendApi.post("/api/adminManager/refresh");
};

export const logoutAPI = () => {
  return backendApi.post("/api/adminManager/logout");
};
