import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import LoginAdmin from "../admin/pages/LoginAdmin";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import PostDetailsUtc2 from "../components/PostDetailsUtc2";
import PostDetails from "../components/PostDetails";
import Message from "../pages/Message";
import Community from "../pages/Community";
import NewsUTC2 from "../pages/NewsUTC2";
import Follow from "../pages/Follow";
import PrivateRoutes from "./privateRoutes";
import PostUnApprovedDetails from "../components/PostUnApprovedDetails";
import HomeAdmin from "../admin/pages/HomeAdmin";
import { useSelector } from "react-redux";
import PrivateAdminRoutes from "./privateAdminRoutes";
import PostDelete from "../admin/pages/PostDelete";
import EditPostModal from "../components/modals/EditPostModal";
import Document from "../pages/Document";
import DocumentDetails from "../components/DocumentDetails";
import UnapprovedDocument from "../components/document/UnapprovedDocument";
import DocumentUnApprovedDetails from "../components/document/DocumentUnApprovedDetails";
import SearchDocument from "../components/document/SearchDocument";
import PostsSaved from "../components/profile/PostsSaved";
import DocumentsSaved from "../components/profile/DocumentsSaved";
import ForgotPassword from "../pages/ForgotPassword";
import Administrators from "../admin/pages/Administrators";
import DocumentDelete from "../admin/pages/DocumentDelete";
import CommentDelete from "../admin/pages/CommentDelete";
import StatiticsPost from "../admin/components/StatiticsPost";
import PostDeleteDetails from "../admin/components/PostDeleteDetails";
import DocumentDeleteDetails from "../admin/components/DocumentDeleteDetails";
import Statistics from "../admin/pages/Statistics";

const AppRoutes = () => {
  const authAdmin = useSelector((state) => state.authAdmin);
  return (
    <>
      <Routes>
        {/* Routes cho phần user */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* Nếu route không tồn tại sẽ quay về Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
