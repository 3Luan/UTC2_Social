import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import {
  getUnreadNotificationAPI,
  readNotificationAPI,
} from "../services/notificationService";

const NotificationCard = ({ notification, handleClosePopup, setCountNoti }) => {
  moment.locale("vi");
  const [pic, setPic] = useState();

  useEffect(() => {
    setPic(
      notification?.sender?.pic?.includes("googleusercontent.com")
        ? notification?.sender?.pic
        : `http://localhost:3001/${notification?.sender?.pic}`
    );
  }, []);

  const onclickReadOneNotification = async () => {
    if (notification && !notification?.isRead) {
      await readNotificationAPI(notification?._id);

      try {
        const data = await getUnreadNotificationAPI();
        setCountNoti(data?.count);
      } catch (error) {
        setCountNoti(null);
      }
    }

    handleClosePopup();
  };

  return (
    <>
      <Link
        to={`${notification?.link}`}
        className="block text-gray-800"
        onClick={() => {
          onclickReadOneNotification();
        }}
      >
        <div
          className={`${
            notification.isRead ? "bg-white " : "bg-gray-300"
          } mt-2 px-6 py-4  rounded-lg shadow w-full`}
        >
          <div className=" inline-flex items-center justify-between w-full">
            <div className="inline-flex items-center">
              <img
                src={pic}
                alt="image"
                className="w-6 h-6 mr-2 rounded-full"
              />
              <h3 className="font-bold text-base text-gray-800">
                {notification?.sender?.name}
              </h3>
            </div>
            <p className="text-xs text-gray-500">
              {moment(notification?.createdAt).fromNow()}
            </p>
          </div>
          <p className="mt-1 text-sm">{notification?.message}</p>
        </div>
      </Link>
    </>
  );
};

export default NotificationCard;
