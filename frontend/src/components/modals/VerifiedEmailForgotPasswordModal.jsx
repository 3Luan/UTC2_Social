import React, { useEffect, useRef, useState } from "react";
import TextInput from "../TextInput";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { handleRefresh } from "../../redux/auth/authAction";
import {
  forgotPasswordAPI,
  verifyCodeForgotPasswordAPI,
} from "../../services/authService";

const VerifiedEmailForgotPasswordModal = ({
  openModal,
  setOpenModal,
  email,
}) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const isValidPassword = (password) => {
    if (password.length >= 6 && !/\s/.test(password)) {
      return true;
    }
    return false;
  };

  const onclickChangePassword = async () => {
    if (code && email && password && passwordConfirm) {
      if (password === passwordConfirm) {
        setIsLoading(true);
        if (isValidPassword(password)) {
          try {
            const data = await verifyCodeForgotPasswordAPI(
              code,
              email,
              password
            );
            toast.success(data?.message);
            navigate("/");
            dispatch(handleRefresh());
          } catch (error) {
            toast.error(error?.data?.message);
          }
          setIsLoading(false);
        } else {
          toast.error("Mật khẩu không đủ mạnh");
        }
      } else {
        toast.error("Mật khẩu không khớp");
      }
    } else {
      toast.error("Không được bỏ trống");
    }
  };

  return (
    <>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50 w-full max-w-md overflow-y-auto bg-white rounded-lg shadow-lg">
            <div className="relative p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl text-center font-semibold text-gray-900">
                {isVerified ? (
                  <>Nhập mật khẩu mới</>
                ) : (
                  <>Nhập mã xác thực Email</>
                )}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-0 right-0 px-4 py-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg focus:outline-none"
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            <div className="bg-white px-4 rounded-lg my-2">
              {/* Hiển thị tên người dùng */}
              <TextInput
                type="text"
                styles="w-full"
                placeholder="Nhập mật khẩu mới...."
                value={password}
                onChange={handlePasswordChange}
              />
              <TextInput
                type="text"
                styles="w-full"
                placeholder="Nhập lại mật khẩu mới...."
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
              />
              <TextInput
                type="text"
                styles="w-full"
                placeholder="Mã xác thực email...."
                value={code}
                onChange={handleCodeChange}
              />
            </div>
            <div className="relative p-4 md:p-5 border rounded-t flex justify-end">
              {isLoading ? (
                <>
                  <button
                    type="button"
                    className="px-9 py-2 text-black hover:bg-teal-300 hover:text-gray-900 rounded-lg focus:outline-none border bg-teal-500"
                  >
                    <i className="fas fa-circle-notch fa-spin"></i>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onclickChangePassword}
                  className="px-4 py-2 text-black hover:bg-teal-300 hover:text-gray-900 rounded-lg focus:outline-none border bg-teal-500"
                >
                  Xác nhận
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifiedEmailForgotPasswordModal;
