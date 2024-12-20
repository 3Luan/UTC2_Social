import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { accessChatAPI } from "../../services/chatService";
import { followUserAPI, unfollowUserAPI } from "../../services/userService";

const UserProfile = ({ data }) => {
  moment.locale("vi");
  const [pic, setPic] = useState("");
  const auth = useSelector((state) => state.auth);
  const [isFollow, setIsFollow] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSendMessage, setIsLoadingSendMessage] = useState(false);
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState();

  useEffect(() => {
    setIsFollow(data?.user?.followers.some((follow) => follow === auth.id));
  }, [data]);

  useEffect(() => {
    setPic(
      data?.user?.pic?.includes("googleusercontent.com")
        ? data?.user?.pic
        : `http://localhost:3001/${data?.user?.pic}`
    );
  }, [data?.user?.pic]);

  const onclickToggleFollow = async (userId) => {
    setIsLoading(true);

    if (isFollow) {
      try {
        await toast.promise(unfollowUserAPI(data?.user?._id), {
          loading: "Loading...",
          success: (data) => {
            return data.message;
          },
          error: (error) => {
            return error.message;
          },
        });
      } catch (error) {}
    } else {
      try {
        await toast.promise(followUserAPI(data?.user?._id), {
          loading: "Loading...",
          success: (data) => {
            return data.message;
          },
          error: (error) => {
            return error.message;
          },
        });
      } catch (error) {}
    }

    setIsFollow(!isFollow);
    setIsLoading(false);
  };

  const accessChat = async () => {
    try {
      setIsLoadingSendMessage(true);
      const datax = await accessChatAPI(data?.user?._id);
      setSelectedChat(datax);
      setIsLoadingSendMessage(false);
    } catch (error) {
      // toast({
      //   title: "Error fetching the chat",
      //   description: error.message,
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom-left",
      // });
    }
  };

  useEffect(() => {
    if (selectedChat) {
      localStorage.setItem("selectedChat", JSON.stringify(selectedChat));
      navigate(`/message/${selectedChat._id}`);
    }
  }, [selectedChat]);

  return (
    <div className="flex-1 h-full flex flex-col gap-6 overflow-y-auto rounded-lg">
      <div className="w-full h-full flex mb-7 pt-4 rounded-xl bg-white shadow-lg duration-200 easy-in-out">
        <div className="flex justify-center px-5  ">
          <img
            className="h-36 w-36 bg-white p-2 rounded-full   "
            src={pic}
            alt=""
          />
        </div>
        <div>
          <div className="pl-4">
            <h2 className="text-gray-800 text-xl font-bold">
              {data?.user?.name}{" "}
              {data?.user.isAdmin && (
                <i className="fa-solid fa-circle-check"></i>
              )}
            </h2>
          </div>
          <div className="pl-4 pt-1">
            <h2 className="text-gray-500 text-sm">
              {data?.user?.gender === "male" ? (
                <>Nam</>
              ) : data?.user?.gender === "female" ? (
                <>Nữ</>
              ) : (
                <>Khác</>
              )}{" "}
              • {moment(data?.user?.birth).format("L")}
            </h2>
          </div>
          <div className="flex bg-transparent my-2    ">
            <div className="text-center p-4 cursor-pointer">
              <p>
                <span className="font-semibold">{data?.countFollowers}</span>{" "}
                Followers
              </p>
            </div>

            <div className="text-center p-4 cursor-pointer">
              <p>
                {" "}
                <span className="font-semibold">
                  {data?.countFollowings}
                </span>{" "}
                Following
              </p>
            </div>
          </div>
          <div className="flex">
            {/* {isFollow ? (
              <>
                <div className="text-center w-30 p-2 ml-4 cursor-pointer rounded-xl bg-gray-200 text-black font-bold text-sm">
                  <p className="">Hủy theo dõi</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center w-30 p-2 ml-4 cursor-pointer rounded-xl bg-gray-200 text-black font-bold text-sm">
                  <p className="">Theo dõi</p>
                </div>
              </>
            )} */}

            {isLoading ? (
              <>
                <div className="text-center py-2 px-2 ms-2 text-black bg-gray-200 font-bold text-sm border border-gray rounded-xl min-w-32">
                  <i className="fas fa-circle-notch fa-spin"></i>
                </div>
                {/* min-w-60 text-center w-30 p-2 ml-4 cursor-pointer rounded-xl bg-gray-200 text-black font-bold text-sm */}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onclickToggleFollow(data._id);
                  }}
                  className={`${
                    isFollow === true
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-black"
                  } py-2 px-2 ms-2 text-black font-bold text-sm border border-gray rounded-xl min-w-32`}
                >
                  {isFollow ? "Hủy theo dõi" : "Theo dõi"}
                </button>
              </>
            )}

            {isLoadingSendMessage ? (
              <>
                <div className="text-center w-30 p-2 ml-4 cursor-pointer rounded-xl bg-gray-200 text-black font-bold text-sm min-w-32">
                  <i className="fas fa-circle-notch fa-spin"></i>
                </div>
              </>
            ) : (
              <>
                <div
                  className="text-center w-30 p-2 ml-4 cursor-pointer rounded-xl bg-gray-200 text-black font-bold text-sm min-w-32"
                  onClick={() => accessChat()}
                >
                  <p className="">Nhắn tin</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
