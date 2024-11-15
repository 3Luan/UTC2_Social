import backendApi from "../api/backendApi";

export const loginAPI = (email, password) => {
  return backendApi.post("/api/auth/login", { email, password });
};

export const refreshAPI = () => {
  return backendApi.post("/api/auth/refresh");
};

export const logoutAPI = () => {
  return backendApi.post("/api/auth/logout");
};
