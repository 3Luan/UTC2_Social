import React, { useEffect, useState } from "react";
import {
  getSavedPostIdAPI,
  savePostdAPI,
  UnsavePostdAPI,
} from "../services/postService";
import toast from "react-hot-toast";

const CustomButtomSavedPost = ({ postId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState();
  const [postSaveId, setPostSaveId] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const data = await getSavedPostIdAPI();
      setPostSaveId(data?.data);
    } catch (error) {
      setPostSaveId([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsSaved(postSaveId.some((id) => id === postId));
  }, [postSaveId]);

  const onclickToggleSave = async () => {
    setIsLoading(true);
    console.log("hello");

    if (isSaved) {
      try {
        await toast.promise(UnsavePostdAPI(postId), {
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
        await toast.promise(savePostdAPI(postId), {
          loading: "Loading...",
          success: (data) => {
            return data?.message;
          },
          error: (error) => {
            return error.message;
          },
        });
      } catch (error) {}
    }

    setIsSaved(!isSaved);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <>
          <button className="pl-2 text-xl font-semibold">
            <i className="fas fa-circle-notch fa-spin w-5 h-5"></i>
            <span className="text-base ml-2">Lưu</span>
          </button>
        </>
      ) : (
        <>
          <button
            className="pl-2 text-xl font-semibold text-slate-600"
            onClick={onclickToggleSave}
          >
            {isSaved ? (
              <i className="fa-solid fa-bookmark  w-5 h-5"></i>
            ) : (
              <i className="fa-regular fa-bookmark  w-5 h-5"></i>
            )}
            <span className="text-base ml-2">Lưu</span>
          </button>
        </>
      )}
    </>
  );
};

export default CustomButtomSavedPost;
