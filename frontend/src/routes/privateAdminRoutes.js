import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateAdminRoutes = (props) => {
  const authAdmin = useSelector((state) => state.authAdmin);
  const navigate = useNavigate();

  if (authAdmin.isInit) {
    return <></>;
  } else {
    if (authAdmin.isLoading) {
      return <></>;
    } else {
      if (!authAdmin.auth) {
        return navigate("/");
      }
    }
  }

  return <>{props.children}</>;
};

export default PrivateAdminRoutes;
