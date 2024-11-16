import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import Header from "./Header";
import FiltersCard from "./FiltersCard";
import Sidebar from "./Sidebar";
import moment from "moment";
import "moment/locale/vi";
import { getPostByIdAPI } from "../services/postUTC2Service";

const PostDetailsUTC2 = () => {
  moment.locale("vi");
  const { postUTC2Id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [postDetailsUTC2, setPostDetailsUTC2] = useState({});

  useEffect(() => {
    getData();
  }, [postUTC2Id]);

  const getData = async () => {
    setIsLoading(true);
    const data = await getPostByIdAPI(postUTC2Id);
    setPostDetailsUTC2(data?.responseData || {});
    setIsLoading(false);
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
          <div className="bg-white p-16 rounded-xl mb-20">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <div className="text-3xl font-medium mb-5">
                  {postDetailsUTC2?.title}
                </div>
                <div className="flex text-md mb-14">
                  <span className="mr-10">
                    Danh mục:{" "}
                    {postDetailsUTC2?.post_connects[0]?.sub_category?.name}
                  </span>

                  <span>
                    Ngày:{" "}
                    {moment(postDetailsUTC2?.created_at).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div
                  className="text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: postDetailsUTC2?.content,
                  }}
                />

                {postDetailsUTC2?.post_attachments?.length > 0 ? (
                  <>
                    <div className="flex text-md mt-14">
                      <span className="mr-10">
                        Chi tiết vui lòng xem file đính kèm:
                      </span>
                    </div>
                    {postDetailsUTC2?.post_attachments.map((item) => (
                      <div className="file-item border border-gray rounded-full p-2">
                        <a
                          href={`https://utc2.edu.vn${item.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.name}
                        </a>
                      </div>
                    ))}
                  </>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsUTC2;
