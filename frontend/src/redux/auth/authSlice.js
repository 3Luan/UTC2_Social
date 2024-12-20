import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: "",
    name: "",
    email: "",
    password: "",
    pic: "",
    isAdmin: "",
    postsSaved: [],
    gender: "",
    birth: "",

    isLoading: false,
    isInit: true,
    auth: false,
  },
  reducers: {
    login: (state) => {
      state.isLoading = true;
      state.isInit = false;
      state.auth = false;
    },
    loginError: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.password = "";
      state.pic = "";
      state.isAdmin = "";
      state.postsSaved = [];
      state.gender = "";
      state.birth = "";

      state.isLoading = false;
      state.isInit = false;
      state.auth = false;
    },
    loginSuccess: (state, action) => {
      state.id = action.payload.user._id;
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
      state.password = action.payload.user.password;
      state.pic = action.payload.user.pic;
      state.isAdmin = action.payload.user.isAdmin;
      state.postsSaved = action.payload.user.postsSaved;
      state.gender = action.payload.user.gender;
      state.birth = action.payload.user.birth;

      state.isLoading = false;
      state.isInit = false;
      state.auth = true;
    },
    refresh: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.password = "";
      state.pic = "";
      state.isAdmin = "";
      state.postsSaved = [];
      state.gender = "";
      state.birth = "";

      state.isLoading = true;
      state.isInit = false;
      state.auth = false;
    },
    refreshError: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.password = "";
      state.pic = "";
      state.isAdmin = "";
      state.postsSaved = [];
      state.gender = "";
      state.birth = "";

      state.isLoading = false;
      state.isInit = false;
      state.auth = false;
    },
    refreshSuccess: (state, action) => {
      state.id = action.payload.user._id;
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
      state.password = action.payload.user.password;
      state.pic = action.payload.user.pic;
      state.isAdmin = action.payload.user.isAdmin;
      state.postsSaved = action.payload.user.postsSaved;
      state.gender = action.payload.user.gender;
      state.birth = action.payload.user.birth;

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
      state.id = "";
      state.name = "";
      state.email = "";
      state.password = "";
      state.pic = "";
      state.isAdmin = "";
      state.postsSaved = [];
      state.gender = "";
      state.birth = "";

      state.isLoading = false;
      state.isInit = false;
      state.auth = false;
    },
    updateSuccess: (state, action) => {
      state.name = action.payload.user.name;
      state.pic = action.payload.user.pic;
      state.gender = action.payload.user.gender;
      state.birth = action.payload.user.birth;
    },
  },
});

export const {
  register,
  registerError,
  registerSuccess,
  login,
  loginError,
  loginSuccess,
  refresh,
  refreshError,
  refreshSuccess,
  logout,
  logoutError,
  logoutSuccess,
  updateSuccess,
} = authSlice.actions;

export default authSlice.reducer;
