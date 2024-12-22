import { createSlice } from "@reduxjs/toolkit";

export const authAdminSlice = createSlice({
  name: "authAdmin",
  initialState: {
    user: null,

    isLoading: false,
    isInit: true,
    authAdmin: false,
  },
  reducers: {
    login: (state) => {
      state.user = null;

      state.isLoading = true;
      state.isInit = false;
      state.auth = false;
    },
    loginError: (state) => {
      state.user = null;

      state.isLoading = false;
      state.isInit = false;
      state.auth = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;

      state.isLoading = false;
      state.isInit = false;
      state.auth = true;
    },
    refresh: (state) => {
      state.user = null;

      state.isLoading = true;
      state.isInit = false;
      state.auth = false;
    },
    refreshError: (state) => {
      state.user = null;

      state.isLoading = false;
      state.isInit = false;
      state.auth = false;
    },
    refreshSuccess: (state, action) => {
      state.user = action.payload.user;

      state.isLoading = false;
      state.isInit = false;
      state.auth = true;
    },
    logout: (state) => {
      state.isLoading = true;
      state.isInit = false;
    },
    logoutError: (state) => {
      state.isLoading = false;
      state.isInit = false;
    },
    logoutSuccess: (state) => {
      state.user = null;

      state.isLoading = false;
      state.isInit = false;
      state.auth = false;
    },
  },
});

export const {
  login,
  loginError,
  loginSuccess,
  refresh,
  refreshError,
  refreshSuccess,
  logout,
  logoutError,
  logoutSuccess,
} = authAdminSlice.actions;

export default authAdminSlice.reducer;
