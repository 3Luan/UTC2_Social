import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import CustomCreateReply from "./CustomCreateReply";
import ReplyCard from "./ReplyCard";
import { useDispatch, useSelector } from "react-redux";
import { handleGetReplyByCommentId } from "../redux/reply/replyAction";
import Loading from "./Loading";
import toast from "react-hot-toast";
import { deleteCommentAPI } from "../services/commentService";
import { Link } from "react-router-dom";

const CommentCard = ({ key, comment, deleteComment, postId }) => {
  moment.locale("vi");
  const dispatch = useDispatch();
  const reply = useSelector((state) => state.reply);
  const auth = useSelector((state) => state.auth);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // State để điều khiển sự hiển thị của menu
  const menuRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [pic, setPic] = useState();

  const addReply = (data) => {
    let updatedReplies = replies.map((comment) => {
      if (comment._id === data.commentId) {
        return {
          ...comment,
          replies: [...comment.replies, data.reply],
        };
      }
      return comment;
    });
    setReplies(updatedReplies);
  };

  const deleteReply = (replyId, commentId) => {
    setReplies((prevReplies) => {
      // Lọc ra danh sách phản hồi mà không có phản hồi có ID trùng với replyId
      const updatedReplies = prevReplies.map((comment) => {
        if (comment._id === commentId) {
          // Lọc ra danh sách các phản hồi mà không có phản hồi có ID trùng với replyId
          const updatedComment = {
            ...comment,
            replies: comment.replies.filter((reply) => reply._id !== replyId),
          };
          return updatedComment;
        }
        return comment;
      });
      return updatedReplies;
    });
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      dispatch(handleGetReplyByCommentId(commentId));
    } else {
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply._id !== commentId)
      );
    }
  };

  useEffect(() => {
    if (showReplyForm && !reply.isLoading) {
      setReplies((prevReplies) => [...prevReplies, reply.data]);
    }
  }, [showReplyForm, reply?.data]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Khi nhấn vào biểu tượng ba chấm, cập nhật trạng thái của menu
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
      comment?.user?.pic?.includes("googleusercontent.com")
        ? comment?.user?.pic
        : `${process.env.REACT_APP_URL_BACKEND}/${comment?.user?.pic}`
    );
  }, [comment?.user?.pic]);

  const onclickDeleteComment = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmed) {
      setIsLoading(true);
      try {
        await toast.promise(deleteCommentAPI(comment?._id), {
          loading: "Đang xóa...",
          success: (data) => {
            deleteComment(comment?._id);
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

  return (
    <div key={key} className="mb-4 py-1 rounded-xl">
      {/* Nội dung bình luận */}
      <div className="flex mb-2">
        <Link to={`/profile/${comment?.user?._id}`} className="">
          <img
            src={pic}
            alt="img"
            className="w-10 h-10 mt-2 rounded-full object-cover min-w-10 min-h-10 mr-1"
          />
        </Link>

        <div className="flex flex-col">
          <div className="bg-slate-100 py-2 px-4 rounded-2xl mt-2">
            <span className="font-medium pt-1">{comment?.user?.name}</span>
            <p className="font-small text-sm">{comment?.content}</p>
          </div>
          <span className="font-medium pt-1">
            <span className="text-sm font-normal text-slate-400">
              {moment(comment?.createdAt).fromNow().charAt(0).toUpperCase() +
                moment(comment?.createdAt).fromNow().slice(1)}
            </span>
            <button
              onClick={() => toggleReplyForm(comment?._id)}
              className="text-sm ml-4"
            >
              Phản hồi
            </button>
          </span>
        </div>
        {/* Menu */}
        {comment?.user?._id === auth?.id || auth?.isAdmin ? (
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
                  onClick={onclickDeleteComment}
                  className="block px-4 py-2 text-gray-800 w-full text-left"
                >
                  Xóa bình luận
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Các phản hồi */}
      {replies.map((item, index) => (
        <React.Fragment key={index}>
          {item._id === comment._id && (
            <div className="ml-14">
              {item.replies.map((reply, index) => (
                <ReplyCard
                  key={index}
                  reply={reply}
                  commentId={comment._id}
                  deleteReply={deleteReply}
                />
              ))}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Form phản hồi */}
      {auth.auth && showReplyForm && (
        <div className="ml-11">
          <CustomCreateReply
            commentId={comment._id}
            addReply={addReply}
            postId={postId}
          />
        </div>
      )}
    </div>
  );
};

export default CommentCard;
