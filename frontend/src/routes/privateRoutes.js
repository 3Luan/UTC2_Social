import { useSelector } from "react-redux";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FiltersCard from "../components/FiltersCard";

const PrivateRoutes = (props) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.auth && !auth.isLoading && !auth.isInit) {
    return (
      <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
        <Header />
        <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
          <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
            <Sidebar />
            <FiltersCard />
          </div>

          {/* CENTER */}
          <div className="w-1/2 h-full flex flex-col justify-center gap-6 overflow-y-auto rounded-lg text-center bg-white">
            Đăng nhập để tiếp tục!
          </div>
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
};

export default PrivateRoutes;
