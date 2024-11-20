import moment from "moment";
import "moment/locale/vi";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { deleteCommentAPI } from "../services/commentService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ReplyCard = ({ key, reply, deleteReply, commentId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = useSelector((state) => state.auth);
  const menuRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [pic, setPic] = useState();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
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

  useEffect(() => {
    setPic(
      reply?.user?.pic?.includes("googleusercontent.com")
        ? reply?.user?.pic
        : `${process.env.REACT_APP_URL_BACKEND}/${reply?.user?.pic}`
    );
  }, [reply.user.pic]);

  const onclickDeleteReply = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmed) {
      setIsLoading(true);
      try {
        await toast.promise(deleteCommentAPI(reply?._id), {
          loading: "Đang xóa...",
          success: (data) => {
            deleteReply(reply?._id, commentId);
            return data?.message;
          },
          error: (error) => {
            return error.message;
          },
        });
      } catch (error) {}

      setMenuOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-2 bg-white p-1 rounded-xl">
      <div className="flex mb-2">
        <Link to={`/profile/${reply?.user?._id}`}>
          <img
            src={pic}
            alt="img"
            className="w-10 h-10 object-cover rounded-full mt-2 min-w-10 min-h-10 mr-1"
          />
        </Link>
        {/* . {moment(reply.updatedAt).fromNow()} */}
        <div className="flex flex-col">
          <div className="bg-slate-100 py-2 px-4 rounded-2xl mt-2">
            <span className="font-medium pt-1">{reply?.user?.name}</span>
            <p className="font-small text-sm">{reply?.content}</p>
          </div>
          <span className="font-medium pt-1">
            <span className="text-sm font-normal text-slate-400">
              {moment(reply?.updatedAt).fromNow().charAt(0).toUpperCase() +
                moment(reply?.updatedAt).fromNow().slice(1)}
            </span>
          </span>
        </div>
        {/* Menu */}
        {reply?.user?._id === auth?.id || auth?.isAdmin ? (
          <div className="flex flex-col items-end relative">
            <button className="px-3 rounded-md" onClick={toggleMenu}>
              <i className="fa-solid fa-ellipsis" />
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-8 bg-white shadow-md rounded-md z-10"
              >
                <button
                  onClick={() => onclickDeleteReply()}
                  className="px-4 py-2 text-gray-800"
                >
                  Xóa phản hồi
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReplyCard;
