import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import FiltersCard from "../components/FiltersCard";
import Sidebar from "../components/Sidebar";
import MyProfile from "../components/profile/MyProfile";
import UserProfile from "../components/profile/UserProfile";
import { getUserInfoByIdAPI } from "../services/userService";
import { useEffect, useState } from "react";

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const { userId } = useParams();
  const [userData, setUserData] = useState();

  const getData = async () => {
    const data = await getUserInfoByIdAPI(userId);
    setUserData(data.data);
  };

  useEffect(() => {
    getData();
  }, [userId]);

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

          {userId === auth.id ? (
            <div className="w-1/2">
              <MyProfile data={userData} />
            </div>
          ) : (
            <div className="w-1/2">
              <UserProfile data={userData} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
