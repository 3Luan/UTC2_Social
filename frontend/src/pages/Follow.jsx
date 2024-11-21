import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import FiltersCard from "../components/FiltersCard";
import Sidebar from "../components/Sidebar";
import FollowCard from "../components/FollowCard";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";
import {
  getFollowersAPI,
  getFollowingsAPI,
  getUnfollowedUsersAPI,
} from "../services/userService";
import CustomPagination from "../components/CustomCustomPagination";
import Loading from "../components/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import SearchUnfollowed from "../components/follow/SearchUnfollowed";
import SearchFollowing from "../components/follow/SearchFollowing";
import SearchFollower from "../components/follow/SearchFollower";

const Follow = () => {
  const [follows, setFollows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [keywordSearch, setKeywordSearch] = useState("");
  const [tabActive, setTabActive] = useState("unfollowed");
  const location = useLocation();
  const navigate = useNavigate();

  const getData = async () => {
    setIsLoading(true);

    try {
      let data;
      if (tabActive === "unfollowed") {
        data = await getUnfollowedUsersAPI(1);
        setFollows(data);
      } else if (tabActive === "following") {
        data = await getFollowingsAPI(1);
        setFollows(data);
      } else if (tabActive === "follower") {
        data = await getFollowersAPI(1);

        setFollows(data);
      }
    } catch (error) {
      setFollows([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [tabActive, location.pathname]);

  const handlePageClick = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    setIsLoading(true);

    let data;
    if (tabActive === "unfollowed") {
      data = await getUnfollowedUsersAPI(selectedPage.selected + 1);
      setFollows(data);
    } else if (tabActive === "following") {
      data = await getFollowingsAPI(selectedPage.selected + 1);
      setFollows(data);
    } else if (tabActive === "follower") {
      data = await getFollowersAPI(selectedPage.selected + 1);
      setFollows(data);
    }
    setIsLoading(false);
  };

  const handleTabChange = (tabName, link) => {
    navigate(link);
    setTabActive(tabName);
    setCurrentPage(0);
  };

  const handleSearch = async (event, currentPage) => {
    if (event?.key === "Enter" || !event?.key) {
      if (keywordSearch) {
        let data;
        if (tabActive === "unfollowed") {
          navigate(`/follow/co-the-quen/search?query=${keywordSearch}`);
        } else if (tabActive === "following") {
          navigate(`/follow/dang-theo-doi/search?query=${keywordSearch}`);
        } else if (tabActive === "follower") {
          navigate(`/follow/nguoi-theo-doi/search?query=${keywordSearch}`);
        }

        setFollows(data);
      }
    }
  };

  return (
    <div className="w-full px-0 pb-20 flex flex-col items-center bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <Header />
      <div className="w-full mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full ">
        <div className="hidden w-1/6 md:flex flex-col gap-6 overflow-y-auto bg-white">
          <Sidebar />
          <FiltersCard />
        </div>

        {/* CENTER */}
        <div className="w-1/2 h-full flex flex-col gap-6 overflow-y-auto rounded-lg bg-white ">
          <div className="flex ml-4 mt-4">
            <CustomButton
              title="Có thể quen"
              containerStyles={`${
                tabActive === "unfollowed"
                  ? "bg-transparent text-gray rounded-none border-b-4 border-blue-700 text-blue-600"
                  : "text-black border-b-4 border-transparent"
              }  py-2 px-3 rounded-lg font-semibold text-sm`}
              onClick={() => handleTabChange("unfollowed", "/follow")}
            />

            <CustomButton
              title="Đang theo dõi"
              containerStyles={`mx-3 ${
                tabActive === "following"
                  ? "bg-transparent text-gray rounded-none border-b-4 border-blue-700 text-blue-600"
                  : "text-black border-b-4 border-transparent"
              } py-2 px-3 rounded-lg font-semibold text-sm`}
              onClick={() => handleTabChange("following", "/follow")}
            />

            <CustomButton
              title="Người theo dõi"
              containerStyles={`${
                tabActive === "follower"
                  ? "bg-transparent text-gray rounded-none border-b-4 border-blue-700 text-blue-600"
                  : "text-black border-b-4 border-transparent"
              } py-2 px-3 rounded-lg font-semibold text-sm`}
              onClick={() => handleTabChange("follower", "/follow")}
            />

            <div className="flex items-center ml-28">
              <TextInput
                styles="mb-1 rounded-md border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                placeholder="Tìm kiếm người dùng..."
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

          <div className="flex flex-wrap">
            {location.pathname === "/follow/co-the-quen/search" ? (
              <>
                <SearchUnfollowed tabActive={tabActive} />
              </>
            ) : location.pathname === "/follow/dang-theo-doi/search" ? (
              <>
                <SearchFollowing tabActive={tabActive} />
              </>
            ) : location.pathname === "/follow/nguoi-theo-doi/search" ? (
              <>
                <SearchFollower tabActive={tabActive} />
              </>
            ) : (
              <>
                {isLoading ? (
                  <Loading />
                ) : follows?.data?.length > 0 ? (
                  <>
                    {follows?.data?.map((item, index) => (
                      <FollowCard
                        key={index}
                        data={item}
                        tabActive={tabActive}
                      />
                    ))}
                    <div className="flex justify-center w-full pb-10">
                      <CustomPagination
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageCount={Math.ceil(follows.count / 12)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Follow;
