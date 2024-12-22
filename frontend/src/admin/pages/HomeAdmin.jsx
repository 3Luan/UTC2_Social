import React, { useEffect, useState } from "react";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import CustomButton from "../../components/CustomButton";
import { useLocation } from "react-router-dom";
import StatiticsPost from "../components/StatiticsPost";
import StatiticsUser from "../components/StatiticsUser";
import StatiticsDocument from "../components/StatiticsDocument";

const HomeAdmin = () => {
  const location = useLocation();
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    const today = new Date();
    setDay(today.getDate());
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  }, []);

  const onClickDay = () => {
    const today = new Date();
    setDay(today.getDate());
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  const onClickMonth = () => {
    const today = new Date();
    setDay(null);
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  const onClickYear = () => {
    const today = new Date();
    setDay(null);
    setMonth(null);
    setYear(today.getFullYear());
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <HeaderAdmin />
      <div className="w-full flex gap-2 lg:gap-4 h-full">
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6">
          <SidebarAdmin />
        </div>

        {/* CENTER */}
        <div className="flex-1 h-full flex flex-col gap-2 overflow-y-auto rounded-lg bg-white mt-4">
          <div className="ml-2 mt-4 border-b pb-4">
            <CustomButton
              title="Ngày"
              containerStyles={`bg-[#0444a4] text-white text-lg mx-2 mt-1 py-3 px-4 rounded-md font-semibold text-sm`}
              onClick={onClickDay}
            />
            <CustomButton
              title="Tháng"
              containerStyles={`bg-[#0444a4] text-white text-lg mx-2 mt-1 py-3 px-4 rounded-md font-semibold text-sm`}
              onClick={onClickMonth}
            />
            <CustomButton
              title="Năm"
              containerStyles={`bg-[#0444a4] text-white text-lg mx-2 mt-1 py-3 px-4 rounded-md font-semibold text-sm`}
              onClick={onClickYear}
            />
          </div>
          <div>
            {location.pathname === "/admin/thong-ke-bai-viet" ? (
              <>
                <StatiticsPost day={day} month={month} year={year} />
              </>
            ) : location.pathname === "/admin/thong-ke-tai-lieu" ? (
              <>
                <StatiticsDocument day={day} month={month} year={year} />
              </>
            ) : (
              <>
                <StatiticsUser day={day} month={month} year={year} />
              </>
            )}

            {/* <StatiticsCard count={data?.count} title={"Bài viết chờ duyệt"} />

            <StatiticsCard count={data?.count} title={"Bài viết đã đăng"} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
