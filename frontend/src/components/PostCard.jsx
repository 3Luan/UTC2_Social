import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { approvedPostAPI, deletePosttAPI } from "../services/postService";
import toast from "react-hot-toast";
import EditPostModal from "./modals/EditPostModal";

const PostCard = ({ post, deletePost, link, addPost }) => {
  moment.locale("vi");
  const auth = useSelector((state) => state.auth);
  const [totalLike, setTotalLike] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [openModalEditPost, setOpenModalEditPost] = useState(false);
  const [pic, setPic] = useState();

  useEffect(() => {
    setTotalLike(post?.likes?.length);
  }, [post?.likes]);

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
      post?.user?.pic?.includes("googleusercontent.com")
        ? post?.user?.pic
        : `${process.env.REACT_APP_URL_BACKEND}/${post?.user?.pic}`
    );
  }, [post?.user?.pic]);

  const onclickApprovedPost = async () => {
    setIsLoading(true);
    try {
      await toast.promise(approvedPostAPI(post?._id), {
        loading: "Đang duyệt...",
        success: (data) => {
          deletePost(post?._id);
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      });
    } catch (error) {}

    setMenuOpen(false);
    setIsLoading(false);
  };

  const onclickDeletePost = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmed) {
      setIsLoading(true);
      try {
        await toast.promise(deletePosttAPI(post?._id), {
          loading: "Đang xóa...",
          success: (data) => {
            deletePost(post?._id);
            return data.message;
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

  const onclickEditPost = () => {
    setMenuOpen(false);
    setOpenModalEditPost(true);
  };

  return (
    <div className="bg-white border-b flex ">
      <div className="flex justify-between items-start w-full max-h-38  ">
        <Link to={`${link}/${post?._id}`}>
          <div className="my-2 bg-white mx-4 py-1 w-full pr-60">
            <div className="flex gap-3 items-center mb-2">
              <div className="flex flex-col">
                <div className="flex items-start">
                  <img className="w-10 h-10 rounded-full" src={pic} alt="" />
                  <div className="flex flex-col justify-start ml-2">
                    <p className="text-sm font-semibold">{post?.user?.name}</p>
                    <span className="text-xs text-gray-500">
                      {moment(post?.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <p className="font-medium text-lg text-ascent-1 text-blue-600 ml-1 my-2">
                  {post?.title}
                </p>
                <div className="flex mt-1">
                  <span className="text-sm text-gray-500 ml-1">
                    {location.pathname === "/community/unapproved" ? (
                      ""
                    ) : (
                      <>Lượt thích: {totalLike}</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Button ellipsis */}
        {post?.user?._id === auth?.id || auth?.isAdmin ? (
          <>
            {location.pathname.startsWith("/bai-viet-da-luu") ||
            location.pathname.startsWith("/tai-lieu-da-luu") ? null : (
              <>
                <div className="flex flex-col items-end">
                  <button className=" px-3 rounded-md" onClick={toggleMenu}>
                    <i className="fa-solid fa-ellipsis" />
                  </button>
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className=" bg-white shadow-xl border rounded-md z-10 mr-2"
                    >
                      {location.pathname === "/community/unapproved" && (
                        <>
                          {auth?.isAdmin ? (
                            <button
                              onClick={() => onclickApprovedPost()}
                              className="block px-4 py-2 text-gray-800"
                            >
                              Duyệt
                            </button>
                          ) : null}
                        </>
                      )}

                      <>
                        {post?.user?._id === auth?.id && (
                          <button
                            onClick={() => onclickEditPost()}
                            className="block px-4 py-2 text-gray-800"
                          >
                            Chỉnh sửa
                          </button>
                        )}
                      </>

                      <button
                        className="block px-4 py-2 text-gray-800"
                        onClick={() => onclickDeletePost()}
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : null}
      </div>

      {openModalEditPost && (
        <EditPostModal
          openModal={openModalEditPost}
          setOpenModal={setOpenModalEditPost}
          postId={post?._id}
          addPost={addPost}
          deletePost={deletePost}
        />
      )}
    </div>
  );
};

export default PostCard;
