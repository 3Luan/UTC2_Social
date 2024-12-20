import backendApi from "../api/backendApi";

export const registerAPI = (name, email, password, gender, birth) => {
  return backendApi.post("/api/auth/register", {
    name,
    email,
    password,
    gender,
    birth,
  });
};

export const verifyCodeAPI = (code, name, email, password, gender, birth) => {
  return backendApi.post("/api/auth/verifyCode", {
    code,
    name,
    email,
    password,
    gender,
    birth,
  });
};

export const sendForgotPasswordAPI = (email) => {
  return backendApi.post("/api/auth/sendForgotPassword", { email });
};

export const verifyCodeForgotPasswordAPI = (code, email) => {
  return backendApi.post("/api/auth/verifyCodeForgotPassword", { code, email });
};

export const forgotPasswordAPI = (email, password) => {
  return backendApi.post("/api/auth/forgotPassword", {
    email,
    password,
  });
};

export const loginAPI = (email, password) => {
  return backendApi.post("/api/auth/login", { email, password });
};

export const refreshAPI = () => {
  return backendApi.post("/api/auth/refresh");
};

export const logoutAPI = () => {
  return backendApi.post("/api/auth/logout");
};

export const updatePasswordAPI = (passwordOld, passwordNew) => {
  return backendApi.post(`/api/auth/updatePassword`, {
    passwordOld,
    passwordNew,
  });
};
