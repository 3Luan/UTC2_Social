import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import logo_utc2 from "../assets/logo_utc2.png";
import VerifiedEmailModal from "../components/modals/VerifiedEmailModal";
import { registerAPI } from "../services/authService";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");

  const isValidEmail = (email) => {
    // Sử dụng regex để kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    if (password.length >= 6 && !/\s/.test(password)) {
      return true;
    }
    return false;
  };

  const onclickRegister = async () => {
    if (name && email && password && passwordConfirm && gender && birth) {
      if (isValidEmail(email)) {
        // Kiểm tra giới tính
        if (gender !== "male" && gender !== "female" && gender !== "other") {
          toast.error("Giới tính không đúng");
          return;
        }

        // Kiểm tra ngày sinh không lớn hơn ngày hiện tại
        const currentDate = new Date().toISOString().split("T")[0];
        if (birth > currentDate) {
          toast.error("Ngày sinh không đúng");
          return;
        }

        // Kiểm tra mật khẩu
        if (!isValidPassword(password)) {
          toast.error("Mật khẩu không đủ mạnh");
          return;
        }

        // Kiểm tra mật khẩu khớp
        if (password !== passwordConfirm) {
          toast.error("Mật khẩu không khớp");
          return;
        }

        // Gọi API đăng ký
        setIsLoading(true);
        try {
          const data = await registerAPI(name, email, password, gender, birth);
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
      toast.error("Không được bỏ trống");
    }
  };

  return (
    <div className="bg-gray-100 w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-white rounded-xl overflow-hidden shadow-xl">
        {/* LEFT */}
        <div className=" w-full lg:w-1/2 h-full 2xl:px-20 flex flex-col justify-center ">
          {/* <div className="w-full flex gap-2 items-center mb-6">
            <div className="rounded text-white w-10">
              <img src={logo_utc2} alt="" />
            </div>
            <span className="text-2xl text-blue-700 " font-semibold>
              UTC2 Social
            </span>
          </div> */}

          <p className="text-ascent-1 font-semibold text-2xl text-center">
            Đăng ký tài khoản
          </p>

          <div className="py-6 flex flex-col ">
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="name"
                label="Họ và tên"
                placeholder="Họ và tên..."
                type="text"
                styles="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!isLoading) onclickRegister();
                  }
                }}
              />
            </div>

            <TextInput
              name="email"
              placeholder="Email..."
              label="Email"
              type="email"
              styles="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!isLoading) onclickRegister();
                }
              }}
            />
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <div className="w-full pt-2">
                <label
                  htmlFor="gender"
                  // className="block text-sm font-medium text-gray-700"
                  className="text-ascent-2 text-sm mb-4"
                >
                  Giới tính
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="p-3 mt-1 pb-[13px] border border-gray-400 rounded  block w-full pl-3 pr-10  text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!isLoading) onclickRegister();
                    }
                  }}
                >
                  <option value="" disabled>
                    Giới tính
                  </option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <TextInput
                name="dateOfBirth"
                label="Ngày sinh"
                placeholder="Date of Birth"
                type="date"
                styles="w-full"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!isLoading) onclickRegister();
                  }
                }}
              />
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="password"
                label="Mật khẩu"
                placeholder="Mật khẩu..."
                type="password"
                styles="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!isLoading) onclickRegister();
                  }
                }}
              />

              <TextInput
                label="Xác nhận mật khẩu"
                placeholder="Xác nhận mật khẩu..."
                type="password"
                styles="w-full"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!isLoading) onclickRegister();
                  }
                }}
              />
            </div>

            <CustomButton
              type="submit"
              containerStyles={`mt-4 inline-flex justify-center rounded-md bg-blue-700 px-8 py-3 text-sm font-medium text-white outline-none`}
              title={
                isLoading ? (
                  <i className="fas fa-circle-notch fa-spin py-1"></i>
                ) : (
                  "Đăng ký"
                )
              }
              onClick={() => {
                if (!isLoading) onclickRegister();
              }}
            />
          </div>

          <p className="text-ascent-2 text-sm text-center">
            Đã có tài khoản?{" "}
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

          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Kết nối với bạn bè và trao đổi kiến thức để phát triển
            </p>
            <span className="text-sm text-white/80">
              Chia sẻ kiến thức và cùng nhau tiến xa hơn nữa.
            </span>
          </div>
        </div>
      </div>
      {openModal && (
        <VerifiedEmailModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          name={name}
          email={email}
          password={password}
          gender={gender}
          birth={birth}
        />
      )}
    </div>
  );
};

export default Register;
