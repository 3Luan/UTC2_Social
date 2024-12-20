import React, { useState } from "react";
import TextInput from "../TextInput";
import toast from "react-hot-toast";
import { updatePasswordAPI } from "../../services/authService";

const EditPasswordModal = ({ openModal, setOpenModal }) => {
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const isValidPassword = (password) => {
    if (password.length >= 6 && !/\s/.test(password)) {
      return true;
    }
    return false;
  };

  // Hàm xử lý khi người dùng lưu thông tin chỉnh sửa
  const handleUpdatePassword = async () => {
    if (passwordOld && passwordNew && passwordConfirm) {
      // Kiểm tra mật khẩu
      if (!isValidPassword(passwordNew)) {
        toast.error("Mật khẩu không đủ mạnh");
        return;
      }
      // Kiểm tra mật khẩu khớp
      if (passwordNew !== passwordConfirm) {
        toast.error("Mật khẩu không khớp");
        return;
      }
      // Gọi API đăng ký
      setIsLoading(true);
      try {
        const data = await updatePasswordAPI(passwordOld, passwordNew);

        toast.success(data?.message);
        setOpenModal(false);
      } catch (error) {
        toast.error(error?.data?.message);
      }
      setIsLoading(false);
    } else {
      toast.error("Không được bỏ trống");
    }

    setIsLoading(false);
  };

  return (
    <>
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative w-1/3 max-w-2xl overflow-y-auto bg-white rounded-lg shadow-lg">
            <div className="relative p-4 md:p-5 rounded-t">
              <h3 className="absolute left-3 top-0 text-xl py-2 text-center font-bold text-gray-900">
                Thay đổi mật khẩu
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-0 right-0 px-4 py-2 text-gray-400 hover:text-gray-900 rounded-lg focus:outline-none"
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            <div className="bg-white px-4 rounded-lg my-2">
              <p className="ml-1 mt-8 font-bold">Mật khẩu cũ</p>
              <TextInput
                type="password"
                styles="w-full rounded-xl border-none bg-gray-200"
                placeholder="Mật khẩu cũ...."
                value={passwordOld}
                onChange={(e) => setPasswordOld(e.target.value)}
              />
              <p className="ml-1 mt-4 font-bold">Mật khẩu mới</p>
              <TextInput
                type="password"
                styles="w-full rounded-xl border-none bg-gray-200"
                placeholder="Mật khẩu mới...."
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
              />
              <p className="ml-1 mt-4 font-bold">Xác nhận mật khẩu mới</p>
              <TextInput
                type="password"
                styles="w-full rounded-xl border-none bg-gray-200"
                placeholder="Xác nhận mật khẩu mới...."
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
            <div className="relative p-4 md:p-5 rounded-t flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-black hover:bg-gray-200 hover:text-gray-900 rounded-lg focus:outline-none mr-2 border-black font-bold"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleUpdatePassword}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg p-2 text-white font-bold not-italic text-sm"
              >
                {isLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPasswordModal;
