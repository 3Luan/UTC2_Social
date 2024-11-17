import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { useSelector } from "react-redux";
import NewsUTC2 from "../pages/NewsUTC2";
import PostDetailsUTC2 from "../components/PostDetailsUTC2";
import Message from "../pages/Message";
import PrivateRoutes from "./privateRoutes";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Routes cho phần user */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/tin-tuc-su-kien" element={<NewsUTC2 />} />
        <Route path="/thong-bao/search" element={<Home />} />
        <Route path="/tin-tuc-su-kien/search" element={<NewsUTC2 />} />
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
        <Route path="/student/post/:postUTC2Id" element={<PostDetailsUTC2 />} />
        <Route
          path="/tin-tuc-su-kien/:postUTC2Id"
          element={<PostDetailsUTC2 />}
        />

        {/* Nếu route không tồn tại sẽ quay về Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
