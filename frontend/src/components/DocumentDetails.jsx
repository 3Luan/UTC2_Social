import React, { useEffect, useState } from "react";
import Header from "./Header";
import FiltersCard from "./FiltersCard";
import Sidebar from "./Sidebar";
import moment from "moment";
import "moment/locale/vi";
import PdfComp from "./PdfComp";
import {
  getDocumentDetailByIdAPI,
  toggleLikeDocumentAPI,
} from "../services/documentService";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import CustomButtomSavedPost from "./CustomButtomSavedPost";
import { toggleLikePostAPI } from "../services/postService";
import toast from "react-hot-toast";
import CustomButtomSavedDocument from "./CustomButtomSavedDocument";

const DocumentDetails = () => {
  moment.locale("vi");
  const [document, setDocument] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { documentId } = useParams();
  const auth = useSelector((state) => state.auth);
  const [isLike, setIsLike] = useState();
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const data = await getDocumentDetailByIdAPI(documentId);
      setDocument(data?.documentDetail);
    } catch (error) {}
    setIsLoading(false);
  };

  useEffect(() => {
    if (documentId) {
      getData();
    }
  }, [documentId]);

  useEffect(() => {
    setIsLike(document?.likes.some((like) => like.user === auth.id));
  }, [document]);

  const onclickToggleLikeDocument = async () => {
    setIsLoadingLike(true);

    try {
      await toast.promise(toggleLikeDocumentAPI(documentId), {
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
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {document ? (
                  <>
                    <div className="text-2xl font-medium">
                      {document?.title}
                    </div>

                    <div className="flex text-xs text-slate-500 mb-3">
                      <span>
                        {moment(document?.post?.created_at)
                          .subtract(0, "days")
                          .calendar()}
                      </span>
                    </div>
                    {/* Render nội dung bài viết với HTML */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: document?.content,
                      }}
                      className="mb-4"
                    ></div>

                    <PdfComp pathFile={document?.files[0]?.path} />
                    {auth.auth ? (
                      <div className="border-t mt-4 border-slate-100">
                        <div className="flex my-4 justify-around">
                          <div>
                            {isLoadingLike ? (
                              <>
                                <button className="pl-2  text-xl">
                                  <i className="fas fa-circle-notch fa-spin"></i>
                                  <span className="text-base ml-2 font-semibold">
                                    Thích
                                  </span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="pl-2 text-xl font-semibold text-slate-600"
                                  onClick={onclickToggleLikeDocument}
                                >
                                  {isLike ? (
                                    <i className="fa-solid fa-thumbs-up"></i>
                                  ) : (
                                    <i className="fa-regular fa-thumbs-up"></i>
                                  )}
                                  <span className="text-base ml-2">Thích</span>
                                </button>
                              </>
                            )}
                          </div>
                          <div className="text-slate-600 font-semibold">
                            <CustomButtomSavedDocument
                              documentId={documentId}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <hr />
                    )}
                  </>
                ) : (
                  <div className="text-center">Tài liệu không tồn tại</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
