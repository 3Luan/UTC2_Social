import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { createReplyAPI } from "../services/commentService";
import toast from "react-hot-toast";

const CustomCreateReply = ({ commentId, addReply, postId }) => {
  const auth = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [pic, setPic] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPic(
      auth?.pic?.includes("googleusercontent.com")
        ? auth?.pic
        : `${process.env.REACT_APP_URL_BACKEND}/${auth?.pic}`
    );
  }, [auth?.pic]);

  const onclickCreateReply = async (event) => {
    if (event?.key === "Enter" || !event?.key) {
      if (!content || !commentId) {
        return toast.error("Hãy nhập nội dung");
      } else {
        setIsLoading(true);
        try {
          await toast.promise(createReplyAPI(content, commentId, postId), {
            loading: "Loading...",
            success: (data) => {
              addReply(data);
              setContent("");
              return data.message;
            },
            error: (error) => {
              return error.message;
            },
          });
        } catch (error) {}
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="w-full flex items-center gap-2 py-2 border-y border-slate-100">
        <img
          src={pic}
          alt="User Image"
          className="w-10 h-10 rounded-full object-cover"
        />

        <TextInput
          styles="w-full border-none -mt-2"
          placeholder="Nội dung phản hồi...."
          value={content}
          onKeyDown={(event) => {
            if (!isLoading && event.key === "Enter") {
              onclickCreateReply();
            }
          }}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="-mt-2">
          <CustomButton
            title={
              isLoading ? (
                <i className="fa-regular fa-paper-plane-top text-xl"></i>
              ) : (
                <i className="fa-solid fa-paper-plane-top text-xl"></i>
              )
            }
            containerStyles={` text-blue-700 mt-2 text-xl py-3 px-5 rounded-full font-semibold text-xl ${
              isLoading && "pointer-events-none"
            }`}
            onClick={() => {
              if (!isLoading) {
                onclickCreateReply();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomCreateReply;
