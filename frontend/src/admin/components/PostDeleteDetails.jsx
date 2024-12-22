import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import HeaderAdmin from "./HeaderAdmin";
import { getPostDeleteDetailByIdAPI } from "../../services/postService";
import SidebarAdmin from "./SidebarAdmin";
import Loading from "../../components/Loading";

const PostDeleteDetails = () => {
  moment.locale("vi");
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const data = await getPostDeleteDetailByIdAPI(postId);
      setData(data?.data);
    } catch (error) {
      setData("");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <HeaderAdmin />

      <div className="w-full flex gap-2 lg:gap-4  h-full">
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <SidebarAdmin />
        </div>

        {/* CENTER */}
        <div className="pt-4 h-full flex-1 flex-col gap-6 overflow-y-auto rounded-lg">
          <div className="bg-white p-4 rounded-xl mb-20">
            {data === "" ? (
              <div className="text-center">Bài viết không tồn tại!</div>
            ) : (
              <>
                {isLoading ? (
                  <Loading />
                ) : (
                  <>
                    <div className="text-2xl font-medium">{data?.title}</div>

                    <div className="flex text-xs text-slate-500 mb-3">
                      <span>
                        {moment(data?.created_at)
                          .subtract(0, "days")
                          .calendar()}
                      </span>
                    </div>
                    {/* Render nội dung bài viết với HTML */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.content,
                      }}
                    />
                    <br />
                    <div className="flex gap-3 flex-wrap">
                      {data?.images &&
                        data?.images?.map((image, index) => {
                          return (
                            <div className="" key={index}>
                              <img
                                className="w-20 h-auto w-full"
                                alt={`Image`}
                                src={`http://localhost:3001/${image?.path}`}
                              />
                            </div>
                          );
                        })}
                    </div>
                    <br />
                    {data?.files?.length > 0 && (
                      <>
                        <div className="text-md font-bold">Files đính kèm:</div>
                        {data?.files.map((file, index) => (
                          <div key={index} className="file-item">
                            <a
                              href={`http://localhost:3001/${file?.path}`}
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

export default PostDeleteDetails;
