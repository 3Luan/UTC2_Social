import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  banUserAPI,
  grantAdminRoleAPI,
  revokeAdminRoleAPI,
  unbanUserAPI,
} from "../../services/userService";

const UserCard = ({ data, tabActive }) => {
  moment.locale("vi");
  const [isLoading, setIsLoading] = useState(false);
  const [pic, setPic] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    setPic(
      data?.pic?.includes("googleusercontent.com")
        ? data?.pic
        : `http://localhost:3001/${data?.pic}`
    );

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onclickGrantAdminRole = async () => {
    if (tabActive === "users") {
      setIsLoading(true);
      try {
        await toast.promise(grantAdminRoleAPI(data._id), {
          loading: "Loading...",
          success: (data) => {
            return data?.message;
          },
          error: (error) => {
            return error?.data?.message;
          },
        });
      } catch (error) {}

      setMenuOpen(false);
      setIsLoading(false);
    }
  };

  const onclickRevokeAdminRole = async () => {
    if (tabActive === "administrators") {
      setIsLoading(true);
      try {
        await toast.promise(revokeAdminRoleAPI(data._id), {
          loading: "Đang duyệt...",
          success: (data) => {
            return data?.message;
          },
          error: (error) => {
            return error?.data?.message;
          },
        });
      } catch (error) {}

      setMenuOpen(false);
      setIsLoading(false);
    }
  };

  const onclickBanUser = async () => {
    if (tabActive === "users") {
      setIsLoading(true);
      try {
        await toast.promise(banUserAPI(data._id), {
          loading: "Loading...",
          success: (data) => {
            return data?.message;
          },
          error: (error) => {
            return error?.data?.message;
          },
        });
      } catch (error) {}

      setMenuOpen(false);
      setIsLoading(false);
    }
  };

  const onclickUnBanUser = async () => {
    if (tabActive === "banUsers") {
      setIsLoading(true);
      try {
        await toast.promise(unbanUserAPI(data._id), {
          loading: "Đang duyệt...",
          success: (data) => {
            return data?.message;
          },
          error: (error) => {
            return error?.data?.message;
          },
        });
      } catch (error) {}
      setMenuOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative border rounded-xl mx-4">
      <Link to={`#`}>
        <div className="my-2 bg-white px-4 py-1 rounded-xl">
          <div className="flex gap-3 items-center mb-2">
            <img
              src={pic}
              alt="img"
              className="w-14 h-14 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-medium text-lg text-ascent-1">{data?.name}</p>
            </div>
          </div>
        </div>
      </Link>

      <button
        className="absolute top-0 right-0 mt-2 px-3 py-1 rounded-md"
        onClick={toggleMenu}
      >
        <i className="fa-solid fa-ellipsis" />
      </button>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-9 right-0 mt-2 bg-white shadow-md rounded-md z-10"
        >
          {tabActive === "users" ? (
            <>
              <button
                onClick={() => onclickGrantAdminRole()}
                className="block px-4 py-2 text-gray-800"
              >
                Gán quyền Người kiểm duyệt
              </button>

              <button
                onClick={() => onclickBanUser()}
                className="block px-4 py-2 text-gray-800"
              >
                Khóa tài khoản
              </button>
            </>
          ) : tabActive === "banUsers" ? (
            <>
              <button
                onClick={() => onclickUnBanUser()}
                className="block px-4 py-2 text-gray-800"
              >
                Gỡ khóa tài khoản
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onclickRevokeAdminRole()}
                className="block px-4 py-2 text-gray-800"
              >
                Xóa quyền Người kiểm duyệt
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
