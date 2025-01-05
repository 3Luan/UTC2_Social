import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/locale/vi";

const CommentCardAdmin = ({ comment }) => {
  moment.locale("vi");
  const [pic, setPic] = useState();

  useEffect(() => {
    setPic(
      comment?.user?.pic?.includes("googleusercontent.com")
        ? comment?.user?.pic
        : `${process.env.REACT_APP_URL_BACKEND}/${comment?.user?.pic}`
    );
  }, [comment?.user?.pic]);

  return (
    <>
      <div className="mb-4 py-1 rounded-xl relative bg-white px-5">
        <div className="flex gap-3 items-start mb-2">
          <img
            src={pic}
            alt="img"
            className="w-10 h-10 object-cover rounded-full mt-2"
          />

          <div className="flex flex-col">
            <div className="bg-slate-100 py-2 px-4 rounded-2xl mt-2">
              <span className="font-medium pt-1">{comment?.user?.name}</span>
              <p className="font-small text-sm">{comment?.content}</p>
            </div>
            <span className="font-medium pt-1">
              <span className="text-sm font-normal text-slate-400">
                {moment(comment?.createdAt).fromNow().charAt(0).toUpperCase() +
                  moment(comment?.createdAt).fromNow().slice(1)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentCardAdmin;
