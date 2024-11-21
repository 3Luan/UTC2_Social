import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loading from "../Loading";
import CustomPagination from "../CustomCustomPagination";
import FollowCard from "../FollowCard";
import { searchFollowersAPI } from "../../services/userService";

const SearchFollower = ({ tabActive }) => {
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
      try {
        const data = await searchFollowersAPI(1, query);

        setData(data?.data);
        setCount(data?.count);
      } catch (error) {
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

      const data = await searchFollowersAPI(selectedPage.selected + 1, query);
      try {
        setData(data?.data);
      } catch (error) {}

      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : data?.length > 0 ? (
            <>
              {data?.map((item, index) => (
                <FollowCard key={index} data={item} tabActive={tabActive} />
              ))}
              <div className="flex justify-center w-full pb-10">
                <CustomPagination
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageCount={Math.ceil(count / 12)}
                  previousLabel="<"
                  currentPage={currentPage}
                />
              </div>
            </>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">
                Không tìm thấy người dùng nào
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SearchFollower;
