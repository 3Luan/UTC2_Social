import toast from "react-hot-toast";
import { loginAPI, logoutAPI, refreshAPI } from "../../services/adminService";
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
} from "./authAdminSlice";

export const handleLoginAdmin = (username, password) => {
  return async (dispatch, getState) => {
    dispatch(login());

    try {
      let res = await loginAPI(username, password);
      // Đăng nhập thành công
      toast.success(res?.message);
      dispatch(loginSuccess(res));
    } catch (error) {
      // Đăng nhập thất bại
      toast.error(error?.data?.message);
      dispatch(loginError());
    }
  };
};

export const handleRefreshAdmin = () => {
  return async (dispatch, getState) => {
    dispatch(refresh());

    try {
      let res = await refreshAPI();

      // Refresh thành công
      dispatch(refreshSuccess(res));
    } catch (error) {
      //Refresh thất bại
      dispatch(refreshError());
    }
  };
};
export const handleLogoutAdmin = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(logout());

    try {
      let res = await logoutAPI();

      toast.success(res.message);
      dispatch(logoutSuccess());
      // Use history object to navigate
      navigate("/admin/login");
    } catch (error) {
      toast.error(error?.data?.message);
      dispatch(logoutError());
    }
  };
};
