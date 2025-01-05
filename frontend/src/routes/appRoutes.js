import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { useSelector } from "react-redux";
import NewsUTC2 from "../pages/NewsUTC2";
import PostDetailsUTC2 from "../components/PostDetailsUTC2";
import Message from "../pages/Message";
import PrivateRoutes from "./privateRoutes";
import Community from "../pages/Community";
import PostDetails from "../components/PostDetails";
import PostUnApprovedDetails from "../components/PostUnApprovedDetails";
import DocumentDetails from "../components/DocumentDetails";
import Follow from "../pages/Follow";
import Document from "../pages/Document";
import DocumentUnApprovedDetails from "../components/document/DocumentUnApprovedDetails";
import DocumentsSaved from "../pages/DocumentsSaved";
import PostsSaved from "../pages/PostsSaved";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import LoginAdmin from "../admin/pages/LoginAdmin";
import HomeAdmin from "../admin/pages/HomeAdmin";
import PrivateAdminRoutes from "./privateAdminRoutes";
import PostDelete from "../admin/pages/PostDelete";
import Administrators from "../admin/pages/Administrators";
import DocumentDelete from "../admin/pages/DocumentDelete";
import CommentDelete from "../admin/pages/CommentDelete";
import StatiticsPost from "../admin/components/StatiticsPost";
import PostDeleteDetails from "../admin/components/PostDeleteDetails";
import DocumentDeleteDetails from "../admin/components/DocumentDeleteDetails";
import Statistics from "../admin/pages/Statistics";
import Category from "../admin/pages/Category";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Routes cho phần user */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/follow"
          element={
            <PrivateRoutes>
              <Follow />
            </PrivateRoutes>
          }
        />
        <Route
          path="/follow/co-the-quen/search"
          element={
            <PrivateRoutes>
              <Follow />
            </PrivateRoutes>
          }
        />
        <Route
          path="/follow/dang-theo-doi/search"
          element={
            <PrivateRoutes>
              <Follow />
            </PrivateRoutes>
          }
        />
        <Route
          path="/follow/nguoi-theo-doi/search"
          element={
            <PrivateRoutes>
              <Follow />
            </PrivateRoutes>
          }
        />

        {/* Routes cho phần Chat*/}
        <Route
          path="/message"
          element={
            <PrivateRoutes>
              <Message />
            </PrivateRoutes>
          }
        />
        <Route
          path="/message/:chatId"
          element={
            <PrivateRoutes>
              <Message />
            </PrivateRoutes>
          }
        />

        {/* Routes cho phần Post UTC2*/}
        <Route path="/student/post/:postUTC2Id" element={<PostDetailsUTC2 />} />
        <Route
          path="/tin-tuc-su-kien/:postUTC2Id"
          element={<PostDetailsUTC2 />}
        />
        <Route path="/tin-tuc-su-kien" element={<NewsUTC2 />} />
        <Route path="/thong-bao/search" element={<Home />} />
        <Route path="/tin-tuc-su-kien/search" element={<NewsUTC2 />} />

        {/* Routes cho phần Post*/}
        <Route path="/community" element={<Community />} />
        <Route
          path="/community/history"
          element={
            <PrivateRoutes>
              <Community />
            </PrivateRoutes>
          }
        />
        <Route path="/community/post/:postId" element={<PostDetails />} />
        <Route
          path="/community/unapproved"
          element={
            <PrivateRoutes>
              <Community />
            </PrivateRoutes>
          }
        />
        <Route
          path="/bai-viet-chua-duyet/:postId"
          element={
            <PrivateRoutes>
              <PostUnApprovedDetails />
            </PrivateRoutes>
          }
        />

        {/* Routes cho phần Document*/}
        <Route path="/tai-lieu" element={<Document />} />
        <Route
          path="/tai-lieu/lich-su"
          element={
            <PrivateRoutes>
              <Document />
            </PrivateRoutes>
          }
        />
        <Route path="/tai-lieu/:documentId" element={<DocumentDetails />} />
        <Route
          path="/tai-lieu/chua-duyet"
          element={
            <PrivateRoutes>
              <Document />
            </PrivateRoutes>
          }
        />
        <Route
          path="/tai-lieu-chua-duyet/:documentId"
          element={
            <PrivateRoutes>
              <DocumentUnApprovedDetails />
            </PrivateRoutes>
          }
        />

        <Route
          path="/bai-viet-da-luu"
          element={
            <PrivateRoutes>
              <PostsSaved />
            </PrivateRoutes>
          }
        />

        <Route
          path="/tai-lieu-da-luu"
          element={
            <PrivateRoutes>
              <DocumentsSaved />
            </PrivateRoutes>
          }
        />

        {/* Routes cho phần Profile*/}
        <Route
          path="/profile/:userId"
          element={
            <PrivateRoutes>
              <Profile />
            </PrivateRoutes>
          }
        />

        {/* ////////////////Routes cho phần admin ////////////////////*/}

        <Route path="/admin/login" element={<LoginAdmin />} />

        <Route
          path="/admin"
          element={
            <PrivateAdminRoutes>
              <Statistics />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/bai-viet-da-xoa"
          element={
            <PrivateAdminRoutes>
              <PostDelete />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/tai-lieu-da-xoa"
          element={
            <PrivateAdminRoutes>
              <DocumentDelete />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/binh-luan-da-xoa"
          element={
            <PrivateAdminRoutes>
              <CommentDelete />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/user"
          element={
            <PrivateAdminRoutes>
              <Administrators />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/thong-ke-bai-viet"
          element={
            <PrivateAdminRoutes>
              <HomeAdmin />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/thong-ke-tai-lieu"
          element={
            <PrivateAdminRoutes>
              <HomeAdmin />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/bai-viet-da-xoa/:postId"
          element={
            <PrivateAdminRoutes>
              <PostDeleteDetails />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/tai-lieu-da-xoa/:documentId"
          element={
            <PrivateAdminRoutes>
              <DocumentDeleteDetails />
            </PrivateAdminRoutes>
          }
        />

        <Route
          path="/admin/danh-muc-tai-lieu"
          element={
            <PrivateAdminRoutes>
              <Category />
            </PrivateAdminRoutes>
          }
        />

        {/* Nếu route không tồn tại sẽ quay về Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
