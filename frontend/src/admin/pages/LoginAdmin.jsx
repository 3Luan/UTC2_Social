import { useState } from "react";
import { useDispatch } from "react-redux";
import TextInput from "../../components/TextInput";
import CustomButton from "../../components/CustomButton";
import logo_utc2 from "../../assets/logo_utc2.png";
import { handleLoginAdmin } from "../../redux/authAdmin/authAdminAction";

const LoginAdmin = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onclickLogin = () => {
    dispatch(handleLoginAdmin(username, password));
  };

  return (
    <div className="bg-gray-100 w-full h-screen flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-white rounded-xl overflow-hidden shadow-xl 2xl:w-2/6">
        <div className="w-full h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="py-5 flex flex-col gap-5 items-center">
            <div className="rounded text-white w-24">
              <img src={logo_utc2} alt="UTC2 Logo" />
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold pb-5">
              Admin UTC2 Social
            </span>
            <TextInput
              name="username"
              placeholder="Tên đăng nhập"
              // label="Username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              styles="w-full rounded-md"
              labelStyle="ml-2"
            />

            <TextInput
              name="password"
              // label="Password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              styles="w-full rounded-md -mt-2"
              labelStyle="ml-2"
            />

            <CustomButton
              type="submit"
              onClick={() => onclickLogin()}
              containerStyles={`inline-flex justify-center rounded-md bg-blue-700 px-8 py-3 text-sm font-medium text-white outline-none w-full`}
              title="Đăng nhập"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
