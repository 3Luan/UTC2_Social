import React from "react";
import { Link } from "react-router-dom";

const FiltersCard = () => {
  return (
    <>
      <div>
        <div className="bg-transparent flex flex-col items-center shadow-sm mx-6  border-b border-[#66666645]">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">
                Cộng đồng sinh viên UTC2
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 py-4 ">
            <Link
              to="/community"
              className="w-full flex gap-4 items-center pb-4 cursor-pointer"
            >
              Trao đổi
            </Link>

            <Link
              to="/tai-lieu"
              className="w-full flex gap-4 items-center pb-4 cursor-pointer"
            >
              Tài liệu
            </Link>
            <Link
              to="/follow"
              className="w-full flex gap-4 items-center pb-4 cursor-pointer"
            >
              Theo dõi
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="w-full bg-transparent flex flex-col items-center shadow-sm px-6">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">Cá nhân</p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 py-4 ">
            <Link
              to="/bai-viet-da-luu"
              className="w-full flex gap-4 items-center pb-4 cursor-pointer"
            >
              Bài viết đã lưu
            </Link>

            <Link
              to="/tai-lieu-da-luu"
              className="w-full flex gap-4 items-center pb-4 cursor-pointer"
            >
              Tài liệu đã lưu
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersCard;
