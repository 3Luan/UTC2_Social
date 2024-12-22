import { useEffect, useState } from "react";
import StatiticsCard from "./StatiticsCard";
import { getNewUserStatisticsAPI } from "../../services/userService";

const StatiticsUser = ({ day, month, year }) => {
  const [countNewUser, setCountNewUser] = useState();

  useEffect(() => {
    getData();
  }, [day, month, year]);

  const getData = async () => {
    try {
      const userNewUserData = await getNewUserStatisticsAPI(day, month, year);
      setCountNewUser(userNewUserData?.count);
    } catch (error) {
      setCountNewUser(0);
    }
  };

  return (
    <div className="pt-4">
      <div className="flex">
        <div className="px-4 w-1/2">
          <StatiticsCard count={countNewUser} title={"Người dùng mới"} />
        </div>
      </div>
    </div>
  );
};

export default StatiticsUser;
