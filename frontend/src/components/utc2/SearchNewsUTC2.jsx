import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../Loading";
import CustomPagination from "../CustomCustomPagination";
import { getSearchNewsUTC2API } from "../../services/postUTC2Service";
import PostCardUTC2 from "../PostCardUTC2";

const SearchNewsUTC2 = ({ tabActive }) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newQuery = new URLSearchParams(location.search).get("query");
    setQuery(newQuery);
  }, [location.search]);

  useEffect(() => {
    getPosts(query);
  }, [query]);

  const getPosts = async (query) => {
    if (query) {
      setIsLoading(true);
      const data = await getSearchNewsUTC2API(1, query);

      if (data?.status === "success") {
        setData(data?.responseData?.rows);
        setCount(data?.responseData?.count);
      } else {
        setData([]);
        setCount(0);
      }
      setIsLoading(false);
    }
  };

  const handlePageClick = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    if (query) {
      setIsLoading(true);
      const data = await getSearchNewsUTC2API(selectedPage.selected + 1, query);
      if (data?.status === "success") {
        setData(data?.responseData?.rows);
        setCount(data?.responseData?.count);
      } else {
        setData([]);
        setCount(0);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : data?.length > 0 ? (
        <>
          {data?.map((item) => (
            <PostCardUTC2 key={item?._id} post={item} link="student/post" />
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
            Không tìm thấy tin tức - sự kiện nào
          </p>
        </div>
      )}
    </>
  );
};

export default SearchNewsUTC2;
