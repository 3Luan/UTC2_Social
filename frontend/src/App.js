import { useEffect, useState } from "react";
import AppRoutes from "./routes/appRoutes";
import { Toaster } from "react-hot-toast";
import { handleRefresh } from "./redux/auth/authAction";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(handleRefresh());
  }, []);

  useEffect(() => {
    if (
      auth.auth &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/");
    }
  }, [auth.auth, location.pathname]);

  return (
    <>
      <AppRoutes />
      <Toaster position="bottom-left" reverseOrder={true} />
    </>
  );
}

export default App;
