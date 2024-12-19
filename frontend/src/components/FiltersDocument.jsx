import React from "react";
import { BsBriefcase, BsFacebook, BsInstagram } from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";

const FiltersDocument = () => {
  return (
    <div>
      <div className="w-full bg-white flex flex-col items-center shadow-sm rounded-xl px-6 py-4">
        <div className="flex flex-row items-center gap-4 pb-6">
          <TextInput
            styles="rounded-md py-2 w-full border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
            placeholder="Tìm kiếm tài liệu..."
          />
          <CustomButton
            title={<i className="fa-solid fa-magnifying-glass"></i>}
            containerStyles={`bg-[#0444a4] text-white mt-2 text-xl py-3 px-4 rounded-md font-semibold text-sm`}
          />
        </div>

        <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium text-ascent-1">
              Lọc theo danh mục
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-[#66666645]">
          <Link
            to="#"
            className="w-full flex gap-4 items-center pb-4 cursor-pointer"
          >
            Giải tích
          </Link>

          <Link
            to="#"
            className="w-full flex gap-4 items-center pb-4 cursor-pointer"
          >
            Giáo trình
          </Link>

          <Link
            to="#"
            className="w-full flex gap-4 items-center pb-4 cursor-pointer"
          >
            Tích phân
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FiltersDocument;
