import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import CustomPagination from "../../components/CustomCustomPagination";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import { getDeleteCommentsAPI } from "../../services/commentService";
import CommentCardAdmin from "../components/CommentCardAdmin";

const CommentDelete = ({}) => {
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (currentPage) => {
    setIsLoading(true);
    const data = await getDeleteCommentsAPI(currentPage);
    setComments(data?.data);
    setCount(data?.count);
    setIsLoading(false);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    getData(selectedPage.selected + 1);
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <HeaderAdmin />

      <div className="w-full flex gap-2 lg:gap-4  h-full">
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <SidebarAdmin />
        </div>

        {/* CENTER */}
        <div className="flex-1 h-full flex flex-col pt-4 overflow-y-auto rounded-lg">
          {isLoading ? (
            <Loading />
          ) : comments?.length > 0 ? (
            <>
              {comments?.map((item) => (
                <>
                  <CommentCardAdmin comment={item} />
                </>
              ))}
              <div className="flex justify-center mb-10">
                <CustomPagination
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageCount={Math.ceil(count / 10)}
                  previousLabel="<"
                  currentPage={currentPage}
                />
              </div>
            </>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">
                Không tìm thấy bình luận, phản hồi nào
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentDelete;
