import { useEffect, useState } from "react";
import AppRoutes from "./routes/appRoutes";
import { Toaster } from "react-hot-toast";
import { handleRefresh } from "./redux/auth/authAction";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { handleRefreshAdmin } from "./redux/authAdmin/authAdminAction";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const authAdmin = useSelector((state) => state.authAdmin);

  const [check, setCheck] = useState(false);

  useEffect(() => {
    dispatch(handleRefresh());

    if (window.location.pathname.startsWith("/admin")) {
      dispatch(handleRefreshAdmin());
    }
  }, []);

  useEffect(() => {
    if (
      auth.auth &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/");
    }

    if (authAdmin.auth && location.pathname === "/admin/login") {
      navigate("/admin");
    }

    if (!location.pathname.startsWith("/message")) {
      localStorage.removeItem("selectedChat");
    }
  }, [auth.auth, location.pathname, authAdmin.auth]);

  return (
    <>
      <AppRoutes />
      <Toaster position="bottom-left" reverseOrder={true} />
    </>
  );
}

export default App;
