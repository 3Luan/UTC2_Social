import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { handleGetPostUnApprovedDetail } from "../redux/postDetails/postDetailsAction";
import Loading from "./Loading";
import Header from "./Header";
import FiltersCard from "./FiltersCard";
import Sidebar from "./Sidebar";
import moment from "moment";
import "moment/locale/vi";

const PostUnApprovedDetails = () => {
  moment.locale("vi");
  const dispatch = useDispatch();
  const postDetails = useSelector((state) => state.postDetails);
  const auth = useSelector((state) => state.auth);
  const { postId } = useParams();

  useEffect(() => {
    dispatch(handleGetPostUnApprovedDetail(postId));
  }, []);

  return (
    <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <Header />
      <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
        <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
          <Sidebar />
          <FiltersCard />
        </div>

        {/* CENTER */}
        <div className="w-1/2   h-full flex flex-col gap-6 overflow-y-auto rounded-lg">
          <div className="bg-white p-4 rounded-xl mb-20">
            {postDetails?.isError ? (
              <div className="text-center">Bài viết không tồn tại!</div>
            ) : (
              <>
                {postDetails.isLoading ? (
                  <Loading />
                ) : (
                  <>
                    <div className="text-2xl font-medium mb-5">
                      {postDetails?.post?.title}
                    </div>

                    <div className="flex text-md mb-14">
                      <span>
                        Ngày:{" "}
                        {moment(postDetails?.post?.created_at).format(
                          "DD/MM/YYYY"
                        )}
                      </span>
                    </div>
                    {/* Render nội dung bài viết với HTML */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: postDetails.post?.content,
                      }}
                    />
                    <br />
                    <div className="flex gap-3 flex-wrap">
                      {postDetails.post?.images &&
                        postDetails.post?.images?.map((image, index) => {
                          return (
                            <div className="" key={index}>
                              <img
                                className="w-20 h-auto"
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
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {/* <div className="w-1/6 bg-transparent h-full"></div> */}
      </div>
    </div>
  );
};

export default PostUnApprovedDetails;
