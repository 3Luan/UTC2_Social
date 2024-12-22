import { useEffect, useState } from "react";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import {
  getUserIsBanStatisticsAPI,
  getUserStatisticsAPI,
} from "../../services/userService";
import CustomButton from "../../components/CustomButton";
import StatiticsUser from "../components/StatiticsUser";
import StatiticsPost from "../components/StatiticsPost";
import StatiticsDocument from "../components/StatiticsDocument";
import StatiticsCard from "../components/StatiticsCard";

const Statistics = ({}) => {
  const [tabActive, setTabActive] = useState("user");
  const [tabChangeTime, setTabChangeTime] = useState("tabDay");
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [count, setCount] = useState();
  const [countIsBan, setCountIsBan] = useState();

  useEffect(() => {
    const today = new Date();
    setDay(today.getDate());
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
    getData();
  }, []);

  const onClickDay = (tabChangeTime) => {
    setTabChangeTime(tabChangeTime);

    const today = new Date();
    setDay(today.getDate());
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  const onClickMonth = (tabChangeTime) => {
    setTabChangeTime(tabChangeTime);

    const today = new Date();
    setDay(null);
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  const onClickYear = (tabChangeTime) => {
    setTabChangeTime(tabChangeTime);

    const today = new Date();
    setDay(null);
    setMonth(null);
    setYear(today.getFullYear());
  };

  const handleTabChange = (tabName) => {
    setTabActive(tabName);
    onClickDay("tabDay");
  };

  useEffect(() => {
    getData();
  }, [day, month, year]);

  const getData = async () => {
    try {
      const userData = await getUserStatisticsAPI();
      setCount(userData?.count);
    } catch (error) {
      setCount(0);
    }

    try {
      const userIsBanData = await getUserIsBanStatisticsAPI();
      setCountIsBan(userIsBanData?.count);
    } catch (error) {
      setCountIsBan(0);
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
                title="Người dùng"
                containerStyles={`mx-2 ${
                  tabActive === "user"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-300 text-black"
                }  py-3 min-w-24 justify-center rounded-lg font-semibold text-sm`}
                onClick={() => handleTabChange("user")}
              />

              <CustomButton
                title="Bài viết"
                containerStyles={`mx-2 ${
                  tabActive === "post"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-300 text-black"
                } py-3 min-w-24 justify-center rounded-lg font-semibold text-sm`}
                onClick={() => handleTabChange("post")}
              />

              <CustomButton
                title="Tài liệu"
                containerStyles={`mx-2 ${
                  tabActive === "document"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-300 text-black"
                } py-3 min-w-24 justify-center rounded-lg font-semibold text-sm`}
                onClick={() => handleTabChange("document")}
              />
            </div>
          </div>

          {tabActive === "user" ? (
            <>
              <div className="pt-4">
                <div className="flex">
                  <div className="px-4 w-1/2">
                    <StatiticsCard count={count} title={"Tất cả người dùng"} />
                  </div>
                  <div className="px-4 w-1/2">
                    <StatiticsCard
                      count={countIsBan}
                      title={"Người dùng đã bị chặn"}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <div className="flex justify-start items-center mt-4 mx-4">
            <CustomButton
              title="Ngày"
              containerStyles={`mx-2 ${
                tabChangeTime === "tabDay"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-300 text-black"
              }  py-3 min-w-24 justify-center rounded-lg font-semibold text-sm`}
              onClick={() => onClickDay("tabDay")}
            />

            <CustomButton
              title="Tháng"
              containerStyles={`mx-2 ${
                tabChangeTime === "tabMonth"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-300 text-black"
              } py-3 min-w-24 justify-center rounded-lg font-semibold text-sm`}
              onClick={() => onClickMonth("tabMonth")}
            />

            <CustomButton
              title="Năm"
              containerStyles={`mx-2 ${
                tabChangeTime === "tabYear"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-300 text-black"
              } py-3 min-w-24 justify-center rounded-lg font-semibold text-sm`}
              onClick={() => onClickYear("tabYear")}
            />
          </div>

          {tabActive === "user" ? (
            <>
              <StatiticsUser day={day} month={month} year={year} />
            </>
          ) : tabActive === "post" ? (
            <>
              <StatiticsPost day={day} month={month} year={year} />
            </>
          ) : tabActive === "document" ? (
            <>
              <StatiticsDocument day={day} month={month} year={year} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
