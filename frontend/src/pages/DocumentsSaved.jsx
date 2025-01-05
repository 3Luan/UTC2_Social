import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FiltersCard from "../components/FiltersCard";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import CustomPagination from "../components/CustomCustomPagination";
import {
  getSaveDocumentAPI,
  searchDocumentSavedAPI,
} from "../services/documentService";

const DocumentsSaved = () => {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState();
  const [keywordSearch, setKeywordSearch] = useState("");

  const getData = async (selectedPage) => {
    setIsLoading(true);

    try {
      let data;
      if (keywordSearch) {
        data = await searchDocumentSavedAPI(1, keywordSearch);
      } else {
        data = await getSaveDocumentAPI(1);
      }

      setPosts(data?.data?.documents);
      setCount(data?.data?.count);
    } catch (error) {
      setPosts([]);
      setCount(0);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePageClick = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    try {
      let data;
      if (keywordSearch) {
        data = await searchDocumentSavedAPI(
          selectedPage.selected + 1,
          keywordSearch
        );
      } else {
        data = await getSaveDocumentAPI(selectedPage.selected + 1);
      }

      setPosts(data?.data?.documents);
      setCount(data?.data?.count);
    } catch (error) {
      setPosts([]);
      setCount(0);
    }
  };

  const handleSearch = async (event) => {
    if (event?.key === "Enter" || !event?.key) {
      setCurrentPage(0);
      getData();
    }
  };

  return (
    <>
      <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
        <Header />
        <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
          <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
            <Sidebar />
            <FiltersCard />
          </div>

          {/* CENTER */}
          <div className="w-1/2 h-full flex flex-col  overflow-y-auto rounded-lg bg-white">
            <div className="flex justify-between mt-3 mx-3 pb-4 border-b">
              <div className=" mt-2 bg-white rounded-md flex">
                <div className="block px-4 py-2 text-gray-800 leading-8 text-2xl font-bold">
                  Tài liệu đã lưu
                </div>
              </div>
              <div className="flex items-center">
                <TextInput
                  styles="mb-1 rounded-md border border-gray-200  text-gray-600 focus:shadow-md transition duration-300 ease-in"
                  placeholder="Tìm kiếm..."
                  onChange={(e) => setKeywordSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(currentPage);
                    }
                  }}
                />
                <CustomButton
                  title={<i className="fa-solid fa-magnifying-glass"></i>}
                  containerStyles={`bg-[#0444a4] text-white text-xl mt-1 py-3 px-4 rounded-md font-semibold text-sm`}
                  onClick={() => {
                    handleSearch(currentPage);
                  }}
                />
              </div>
            </div>

            {isLoading ? (
              <Loading />
            ) : posts.length > 0 ? (
              <>
                {posts.map((item) => (
                  <PostCard key={item.id} post={item} link={"/tai-lieu"} />
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
              <div className="flex w-full h-full items-center justify-center bg-white">
                <p className="text-lg text-ascent-2">
                  Bạn chưa lưu tài liệu nào.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentsSaved;
