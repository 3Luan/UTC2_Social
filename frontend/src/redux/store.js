import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import postSlice from "./post/postSlice";
import postDetailsSlice from "./postDetails/postDetailsSlice";
import replySlice from "./reply/replySlice";
import authAdminSlice from "./authAdmin/authAdminSlice";

export default configureStore({
  reducer: {
    auth: authSlice,
    post: postSlice,
    postDetails: postDetailsSlice,
    reply: replySlice,

    // Admin
    authAdmin: authAdminSlice,
  },
});
