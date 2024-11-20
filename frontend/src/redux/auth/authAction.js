import toast from "react-hot-toast";
import { loginAPI, logoutAPI, refreshAPI } from "../../services/authService";
import {
  login,
  loginError,
  loginSuccess,
  logout,
  logoutError,
  logoutSuccess,
  refresh,
  refreshError,
  refreshSuccess,
} from "./authSlice";

export const handleLogin = (email, password) => {
  return async (dispatch, getState) => {
    try {
      dispatch(login());

      let res = await loginAPI(email, password);

      // Đăng nhập thành công
      toast.success(res?.message);
      dispatch(loginSuccess(res?.data));
    } catch (error) {
      // Đăng nhập thất bại
      toast.error(error?.data?.message || "Đăng nhập thất bại!");
      dispatch(loginError());
    }
  };
};

export const handleRefresh = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(refresh());

      let res = await refreshAPI();
      // Refresh thành công
      dispatch(refreshSuccess(res?.data));
    } catch (error) {
      // Refresh thất bại
      dispatch(refreshError());
    }
  };
};

export const handleLogout = (navigate) => {
  return async (dispatch, getState) => {
    try {
      dispatch(logout());

      let res = await logoutAPI();
      navigate("/login");
      // Logout thành công
      dispatch(logoutSuccess(res?.data));
    } catch (error) {
      console.log(error);
      // Logout thất bại
      dispatch(logoutError());
    }
  };
};
