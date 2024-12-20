import React, { useEffect, useRef, useState } from "react";
import {
  createPostAPI,
  getPostDetailByIdAPI,
  updatePostAPI,
} from "../../services/postService";
import CustomCreatePost from "../CustomCreatePost";
import TextInput from "../TextInput";
import ReactQuill from "react-quill";
import CustomButton from "../CustomButton";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProfileAPI } from "../../services/userService";
import {
  handleRefresh,
  handleUpdateProfile,
} from "../../redux/auth/authAction";
import { verifyCodeAPI } from "../../services/authService";

const VerifiedEmailModal = ({
  openModal,
  setOpenModal,
  name,
  email,
  password,
  gender,
  birth,
}) => {
  const auth = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const onclickVerify = async () => {
    if (code && name && email && password && gender && birth) {
      setIsLoading(true);
      try {
        const data = await verifyCodeAPI(
          code,
          name,
          email,
          password,
          gender,
          birth
        );
        toast.success(data?.message);
        navigate("/");
        dispatch(handleRefresh());
      } catch (error) {
        toast.error(error?.data?.message);
      }
      setIsLoading(false);
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
                Nhập mã xác thực Email
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
                placeholder="Mã xác thực email...."
                value={code}
                onChange={handleCodeChange}
              />
            </div>
            <div className="relative p-4 md:p-5 border rounded-t flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!isLoading) onclickVerify();
                }}
                className="px-4 py-2 text-black hover:bg-teal-300 hover:text-gray-900 rounded-lg focus:outline-none border bg-teal-500"
              >
                {isLoading ? (
                  <i className="fas fa-circle-notch fa-spin py-1 px-5"></i>
                ) : (
                  <>Xác thực</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifiedEmailModal;
