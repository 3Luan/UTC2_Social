import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo_utc2 from "../../assets/logo_utc2.png";
import { handleLogoutAdmin } from "../../redux/authAdmin/authAdminAction";
import CustomButton from "../../components/CustomButton";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickLogout = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      dispatch(handleLogoutAdmin(navigate));
    }
  };

  return (
    <div className="topbar w-full flex items-center justify-between py-3 md:py-3 px-4 bg-white">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 w-16 rounded text-white">
          <img src={logo_utc2} alt="" />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
          Admin UTC2 Social
        </span>
      </Link>

      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <div>
          <CustomButton
            onClick={() => onClickLogout()}
            title="Đăng xuất"
            containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
