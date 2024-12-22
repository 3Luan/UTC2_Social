import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import CustomPagination from "../../components/CustomCustomPagination";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import {
  getAllAdminUsersAPI,
  getAllNonAdminUsersAPI,
  getBanUsersAPI,
  searchAllAdminUsersAPI,
  searchBanUsersAPI,
  searchAllNonAdminUsersAPI,
} from "../../services/userService";
import UserCard from "../components/UserCard";
import CustomButton from "../../components/CustomButton";
import TextInput from "../../components/TextInput";

const Administrators = ({}) => {
  const [user, setUser] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tabActive, setTabActive] = useState("administrators");
  const [keywordSearch, setKeywordSearch] = useState("");

  useEffect(() => {
    getData();
  }, [tabActive]);

  const handleSearch = async (currentPage) => {
    getData();
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    getData(selectedPage.selected + 1);
  };

  const handleTabChange = (tabName) => {
    setTabActive(tabName);
    setCurrentPage(0);
  };

  const getData = async (currentPage) => {
    let data;
    if (tabActive === "administrators") {
      setIsLoading(true);
      try {
        if (keywordSearch) {
          data = await searchAllAdminUsersAPI(currentPage, keywordSearch);
        } else {
          data = await getAllAdminUsersAPI(currentPage);
        }
        setUser(data?.data);
        setCount(data?.count);
      } catch (error) {
        setUser([]);
        setCount(0);
      }
      setIsLoading(false);
    } else if (tabActive === "users") {
      setIsLoading(true);

      try {
        if (keywordSearch) {
          data = await searchAllNonAdminUsersAPI(currentPage, keywordSearch);
        } else {
          data = await getAllNonAdminUsersAPI(currentPage);
        }
        setUser(data?.data);
        setCount(data?.count);
      } catch (error) {
        setUser([]);
        setCount(0);
      }
      setIsLoading(false);
    } else if (tabActive === "banUsers") {
      setIsLoading(true);
      try {
        if (keywordSearch) {
          data = await searchBanUsersAPI(currentPage, keywordSearch);
        } else {
          data = await getBanUsersAPI(currentPage);
        }
        setUser(data?.data);
        setCount(data?.count);
      } catch (error) {
        setUser([]);
        setCount(0);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <HeaderAdmin />

      <div className="w-full flex gap-2 lg:gap-4  h-full">
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <SidebarAdmin />
        </div>

        {/* CENTER */}

        <div className="flex-1 h-full flex flex-col  overflow-y-auto rounded-lg bg-white mt-4">
          <div className="flex mt-4 mx-4 items-center justify-between">
            <div className="flex items-center">
              <CustomButton
                title="Người kiểm duyệt"
                containerStyles={`mx-2 ${
                  tabActive === "administrators"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-300 text-black"
                }  py-3 px-2 rounded-lg font-semibold text-sm`}
                onClick={() => handleTabChange("administrators")}
              />

              <CustomButton
                title="Người dùng"
                containerStyles={`mx-2 ${
                  tabActive === "users"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-300 text-black"
                } py-3 px-8 rounded-lg font-semibold text-sm`}
                onClick={() => handleTabChange("users")}
              />

              <CustomButton
                title="Người dùng bị chặn"
                containerStyles={`mx-2 ${
                  tabActive === "banUsers"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-300 text-black"
                } py-3 px-2 rounded-lg font-semibold text-sm`}
                onClick={() => handleTabChange("banUsers")}
              />
            </div>

            <div className="flex justify-start items-center">
              <TextInput
                styles="-mt-2 rounded-md border border-gray-200 bg-gray-200 text-gray-600 transition duration-300 ease-in w-auto"
                placeholder="Tìm kiếm..."
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(currentPage);
                  }
                }}
              />

              <CustomButton
                title={<i className="fa-solid fa-magnifying-glass"></i>}
                containerStyles={`bg-[#0444a4] text-white text-xl py-3 px-4 rounded-md font-semibold text-sm`}
                onClick={() => {
                  handleSearch(currentPage);
                }}
              />
            </div>
          </div>

          {isLoading ? (
            <Loading />
          ) : user?.length > 0 ? (
            <>
              {user?.map((item) => (
                <div className="pt-4">
                  <UserCard key={item.id} data={item} tabActive={tabActive} />
                </div>
              ))}
              <div className="flex justify-center mb-10">
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
              <p className="text-lg text-ascent-2">Không tìm thấy user nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Administrators;
