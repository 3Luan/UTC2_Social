import Header from "../components/Header";
import FiltersCard from "../components/FiltersCard";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <>
      <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
        <Header />
        <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
          <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
            <Sidebar />
            <FiltersCard />
          </div>

          {/* CENTER */}
          <div className="w-1/2 h-full flex flex-col gap-2 overflow-y-auto rounded-lg bg-white">
            <div className="flex  mt-3 mx-3 pb-4 border-b justify-between">
              <div className=" mt-2 bg-white z-10 rounded-md flex">
                <div className="block px-4 py-2 text-gray-800 leading-8 text-2xl font-bold">
                  Thông báo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
