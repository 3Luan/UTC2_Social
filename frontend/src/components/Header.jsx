import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { handleLogout } from "../redux/auth/authAction";
import logo_utc2 from "../assets/logo_utc2.png";

const Header = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathname = window.location.pathname;

  const onClickLogout = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      dispatch(handleLogout(navigate));
    }
  };

  const onClickLogin = () => {
    navigate("/login");
  };

  return (
    <div className="fixed left-0 w-screen flex items-center justify-between py-3 md:py-3 px-4 bg-white border-b">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 w-16 rounded text-white">
          <img src={logo_utc2} alt="" />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
          UTC2 Social
        </span>
      </Link>

      {pathname.startsWith("/message") ? (
        <div className="text-xl md:text-1xl font-bold">Nhắn tin</div>
      ) : pathname.startsWith("/profile") ? (
        <>
          <div className="text-xl md:text-1xl font-bold">Trang cá nhân</div>
        </>
      ) : (
        <div className="text-xl md:text-1xl font-bold">
          Diễn đàn trao đổi học tập sinh viên UTC2
        </div>
      )}

      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <div className="hidden lg:flex">
          {pathname.startsWith("/message") ? (
            <Link to="/">
              <i className="fa-solid fa-house px-2"></i>
            </Link>
          ) : (
            <Link to="/message">
              <i className="fa-solid fa-message px-2"></i>
            </Link>
          )}

          <button className="relative">
            <i className="fa-solid fa-bell px-2"></i>
          </button>

          <Link to={`/profile/${auth.id}`}>
            <i className="fa-solid fa-user px-2"></i>
          </Link>
        </div>

        <div>
          {auth.isLoading || auth.isInit ? null : (
            <>
              {auth.auth ? (
                <CustomButton
                  onClick={() => onClickLogout()}
                  title="Đăng xuất"
                  containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
                />
              ) : (
                <CustomButton
                  onClick={() => onClickLogin()}
                  title="Đăng nhập"
                  containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
