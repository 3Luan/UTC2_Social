import { useState } from "react";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import CustomButton from "../components/CustomButton";
import logo_utc2 from "../assets/logo_utc2.png";
import { sendForgotPasswordAPI } from "../services/authService";
import toast from "react-hot-toast";
import VerifiedEmailForgotPasswordModal from "../components/modals/VerifiedEmailForgotPasswordModal";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => {
    // Sử dụng regex để kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onclickSendRequire = async () => {
    if (email) {
      if (isValidEmail(email)) {
        setIsLoading(true);
        try {
          const data = await sendForgotPasswordAPI(email);
          toast.success(data?.message);
          setOpenModal(true);
        } catch (error) {
          toast.error(error?.data?.message);
        }
        setIsLoading(false);
      } else {
        toast.error("Email không đúng định dạng");
      }
    } else {
      toast.error("Hãy nhập email");
    }
  };

  return (
    <div className="bg-gray-100 w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-white rounded-xl overflow-hidden shadow-xl">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center ">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="rounded text-white w-20">
              <img src={logo_utc2} alt="" />
            </div>

            <span className="text-2xl text-blue-700 font-semibold">
              UTC2 Social
            </span>
          </div>

          <p className="text-ascent-1 text-base font-semibold">
            Nhập Email để lấy lại mật khẩu
          </p>

          <div
            className="py-5 flex flex-col gap-5="
            // onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="email"
              placeholder="Email..."
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              styles="w-full  mb-4"
              labelStyle="ml-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!isLoading) onclickSendRequire();
                }
              }}
            />

            <CustomButton
              type="submit"
              containerStyles={`inline-flex justify-center rounded-md bg-blue-700 px-8 py-3 text-sm font-medium text-white outline-none`}
              title={
                isLoading ? (
                  <i className="fas fa-circle-notch fa-spin py-1"></i>
                ) : (
                  "Gửi yêu cầu"
                )
              }
              onClick={() => {
                if (!isLoading) onclickSendRequire();
              }}
            />
          </div>

          <p className="text-ascent-2 text-sm text-center pt-2">
            <Link
              to="/login"
              className="text-blue-700 font-semibold ml-2 cursor-pointer"
            >
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* RIGHT */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-yellow-400">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={logo_utc2}
              alt="Bg Image"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover"
            />

            <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14} />
              <span className="text-xs font-medium">Chia sẻ</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection />
              <span className="text-xs font-medium">Kết nối</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
              <AiOutlineInteraction />
              <span className="text-xs font-medium">Tương tác</span>
            </div>
          </div>

          {/* <div className="mt-16 text-center">
            <p className="text-white text-base">
              Connect with friedns & have share for fun
            </p>
            <span className="text-sm text-white/80">
              Share memories with friends and the world.
            </span>
          </div> */}
        </div>
      </div>
      {openModal && (
        <VerifiedEmailForgotPasswordModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          email={email}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
