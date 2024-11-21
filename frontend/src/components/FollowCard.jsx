import React, { useEffect, useState } from "react";
import { followUserAPI, unfollowUserAPI } from "../services/userService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FollowCard = ({ data, tabActive }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollow, setIsFollow] = useState();
  const [pic, setPic] = useState();

  useEffect(() => {
    setIsFollow("");

    if (tabActive === "unfollowed") {
      setIsFollow(false);
    } else if (tabActive === "following") {
      setIsFollow(true);
    }
  }, [tabActive]);

  useEffect(() => {
    setPic(
      data?.pic?.includes("googleusercontent.com")
        ? data?.pic
        : `${process.env.REACT_APP_URL_BACKEND}/${data?.pic}`
    );
  }, [data?.pic]);

  const onclickToggleFollow = async (userId) => {
    setIsLoading(true);

    if (isFollow) {
      try {
        await toast.promise(unfollowUserAPI(userId), {
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
        await toast.promise(followUserAPI(userId), {
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

  return (
    <div className="mb-2 mx-2 w-[calc(50%-16px)] bg-white rounded-lg border border-slate-200 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center p-4">
          <Link to={`/profile/${data._id}`}>
            <img
              className="w-16 h-16 rounded-xl border border-slate-100"
              src={pic}
              alt="avatar"
            />
          </Link>
          <Link
            to={`/profile/${data._id}`}
            className="mb-1 px-3 text-sm font-bold overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full text-center"
          >
            {data.name}
          </Link>
        </div>
        <div className="flex mr-2">
          {tabActive === "unfollowed" ? (
            <>
              {isLoading ? (
                <>
                  <button>
                    <i className="fas fa-circle-notch fa-spin"></i>
                  </button>
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
                        : "bg-gray-300 text-black"
                    } py-2 px-2 ms-2 text-sm font-medium border border-gray rounded-lg`}
                  >
                    {isFollow ? "Hủy theo dõi" : "Theo dõi"}
                  </button>
                </>
              )}
            </>
          ) : tabActive === "following" ? (
            <>
              {isLoading ? (
                <>
                  <button>
                    <i className="fas fa-circle-notch fa-spin"></i>
                  </button>
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
                        : "bg-gray-400 text-black"
                    } py-2 px-2 ms-2 text-sm font-medium border border-gray rounded-lg`}
                  >
                    {isFollow ? "Hủy theo dõi" : "Theo dõi"}
                  </button>
                </>
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
