import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { handleGetPostDetailById } from "../redux/postDetails/postDetailsAction";
import Loading from "./Loading";
import CustomCreateComment from "./CustomCreateComment";
import CommentCard from "./CommentCard";
import { toggleLikePostAPI } from "../services/postService";
import toast from "react-hot-toast";
import Header from "./Header";
import FiltersCard from "./FiltersCard";
import Sidebar from "./Sidebar";
import { getCommentByPostIdAPI } from "../services/commentService";
import moment from "moment";
import "moment/locale/vi";
import CustomButtomSavedPost from "./CustomButtomSavedPost";

const PostDetails = () => {
  moment.locale("vi");
  const dispatch = useDispatch();
  const postDetails = useSelector((state) => state.postDetails);
  const auth = useSelector((state) => state.auth);
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [isLike, setIsLike] = useState();
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  useEffect(() => {
    dispatch(handleGetPostDetailById(postId));
    getComment();
  }, [postId]);

  const getComment = async () => {
    setIsLoadingComment(true);
    await getCommentByPostIdAPI(postId).then((data) => {
      setComments(data?.comment || []);
    });
    setIsLoadingComment(false);
  };

  const deleteComment = (commentId) => {
    setComments((comments) =>
      comments.filter((comment) => comment._id !== commentId)
    );
  };

  useEffect(() => {
    setIsLike(postDetails?.post?.likes.some((like) => like.user === auth.id));
  }, [postDetails?.post]);

  const addComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const onclickToggleLikePost = async () => {
    setIsLoadingLike(true);
    try {
      await toast.promise(toggleLikePostAPI(postId), {
        loading: "Loading...",
        success: (data) => {
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      });
    } catch (error) {}

    setIsLike(!isLike); // Khi người dùng click để toggle like, cập nhật lại trạng thái của isLiked
    setIsLoadingLike(false);
  };

  return (
    <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <Header />
      <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
        <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
          <Sidebar />
          <FiltersCard />
        </div>

        {/* CENTER */}
        <div className="w-1/2 h-full flex flex-col gap-6 overflow-y-auto rounded-lg">
          <div className="bg-white p-4 rounded-xl mb-20">
            {postDetails?.isError ? (
              <div className="text-center">Bài viết không tồn tại!</div>
            ) : (
              <>
                {postDetails?.isLoading ? (
                  <Loading />
                ) : (
                  <>
                    <div className="text-2xl font-medium">
                      {postDetails?.post?.title}
                    </div>

                    <div className="flex text-xs text-slate-500 mb-3">
                      <span>
                        {moment(postDetails?.post?.created_at)
                          .subtract(0, "days")
                          .calendar()}
                      </span>
                    </div>
                    {/* Render nội dung bài viết với HTML */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: postDetails?.post?.content,
                      }}
                    />
                    <br />
                    <div className="flex gap-3 flex-wrap">
                      {postDetails?.post?.images &&
                        postDetails?.post?.images?.map((image, index) => {
                          return (
                            <div className="" key={index}>
                              <img
                                className="w-20 h-auto w-full"
                                alt={`Image`}
                                src={`${process.env.REACT_APP_URL_BACKEND}/${image?.path}`}
                              />
                            </div>
                          );
                        })}
                    </div>
                    <br />
                    {postDetails?.post?.files?.length > 0 && (
                      <>
                        <div className="text-md font-bold">Files đính kèm:</div>
                        {postDetails?.post?.files.map((file, index) => (
                          <div key={index} className="file-item">
                            <a
                              href={`${process.env.REACT_APP_URL_BACKEND}/${file?.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file?.name}
                            </a>
                          </div>
                        ))}
                      </>
                    )}
                    <br />

                    {auth.auth ? (
                      <div className="border-t border-slate-100">
                        <div className="flex my-2 justify-around">
                          <div className="">
                            {isLoadingLike ? (
                              <>
                                <button className="pl-2  text-xl font-semibold">
                                  <i className="fas fa-circle-notch fa-spin"></i>
                                  <span className="text-base ml-2">Thích</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="pl-2 text-xl text-slate-600 font-semibold"
                                  onClick={onclickToggleLikePost}
                                >
                                  {isLike ? (
                                    <i className="fa-solid fa-thumbs-up"></i>
                                  ) : (
                                    <i className="fa-regular fa-thumbs-up "></i>
                                  )}
                                  <span className="text-base ml-2">Thích</span>
                                </button>
                              </>
                            )}
                          </div>
                          <div className="text-slate-600 font-semibold">
                            <CustomButtomSavedPost postId={postId} />
                          </div>
                        </div>
                        <CustomCreateComment
                          postId={postId}
                          addComment={addComment}
                        />
                      </div>
                    ) : (
                      <hr />
                    )}

                    {isLoadingComment ? (
                      <>
                        <Loading />
                      </>
                    ) : (
                      <>
                        {comments.length > 0 ? (
                          comments.map((item, index) => (
                            <CommentCard
                              key={index}
                              postId={postId}
                              comment={item}
                              deleteComment={deleteComment}
                            />
                          ))
                        ) : (
                          <div className="mb-2 bg-white p-4 rounded-xl">
                            <div className="flex gap-3 items-center mb-2">
                              Bài viết chưa có bình luận nào.
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
