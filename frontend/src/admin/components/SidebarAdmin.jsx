import React from "react";
import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <div>
      <div className="w-full h-screen bg-white shadow-sm px-6 py-5 mt-4">
        <div className="w-full flex flex-col gap-2 py-3">
          <div className="w-full flex items-center justify-between border-b py-2 pt-4 border-[#66666645]">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">Quản lý</p>
            </div>
          </div>
          <Link
            to="/admin"
            className="w-full flex items-center gap-4 py-2 cursor-pointer h-full"
          >
            <span>Thống kê</span>
          </Link>
          <Link
            to="/admin/user"
            className="w-full flex items-center gap-4 py-2 cursor-pointer h-full"
          >
            <span>Tài khoản</span>
          </Link>
          <Link
            to="/admin/bai-viet-da-xoa"
            className="w-full flex items-center  gap-4 py-2 cursor-pointer h-full"
          >
            <span>Bài viết</span>
          </Link>
          <Link
            to="/admin/tai-lieu-da-xoa"
            className="w-full flex items-center  gap-4 py-2 cursor-pointer h-full"
          >
            <span>Tài liệu</span>
          </Link>
          <Link
            to="/admin/binh-luan-da-xoa"
            className="w-full flex items-center  gap-4 py-2 cursor-pointer h-full"
          >
            <span>Bình luận, phản hồi</span>
          </Link>

          <div className="w-full flex items-center justify-between border-b py-2 pt-4 border-[#66666645]"></div>
          <Link
            to="/admin/danh-muc-tai-lieu"
            className="w-full flex items-center  gap-4 py-2 cursor-pointer h-full"
          >
            <span>Danh mục tài liệu</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
