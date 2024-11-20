import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { createPostAPI } from "../services/postService";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";

const CustomCreatePost = ({ addPost, auth }) => {
  const [content, setContent] = useState("");
  const [loadCreatePost, setLoadCreatePost] = useState(false);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const quillRef = useRef();

  const onclickCreatePosts = async () => {
    if (!title) {
      return toast.error("Tiêu đssssề không đưddợc bỏ trống!");
    } else if (!content) {
      return toast.error("Nội dung không được bỏ trống!");
    } else {
      setLoadCreatePost(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      try {
        await toast.promise(createPostAPI(formData), {
          loading: "Bài viết đang được tạo...",
          success: (data) => {
            setLoadCreatePost(false);
            if (auth.isAdmin) {
              addPost(data?.data);
            }
            setTitle("");
            setContent("");
            setImages([]);
            setFiles([]);
            return data.message;
          },
          error: (error) => {
            setLoadCreatePost(false);
            return error.message;
          },
        });
      } catch (error) {}
    }
  };

  return (
    <div className="bg-white px-4 rounded-lg my-2">
      <TextInput
        styles="w-full"
        placeholder="Tiêu đề bài viết...."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={setContent}
        formats={CustomCreatePost.formats}
        modules={CustomCreatePost.modules}
        placeholder="Nội dung bài viết..."
      />
      <div className="flex gap-3 items-center">
        <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
          <input
            type="file"
            onChange={(e) => setImages(e.target.files)}
            className="hidden"
            accept=".jpg, .png, .jpeg , image/*"
            multiple
          />
          <i className="fa-solid fa-image"></i>
          <span>Image</span>
        </label>

        <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="hidden"
            accept=".pdf, .doc, .docx"
          />
          <i className="fa-solid fa-file"></i>
          <span>Files</span>
        </label>

        <CustomButton
          title={
            loadCreatePost ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              "Create Post"
            )
          }
          containerStyles={`bg-[#0444a4] text-white m-1 py-1 px-2 rounded-full font-semibold text-sm ${
            loadCreatePost && "pointer-events-none"
          }`}
          onClick={() => {
            if (!loadCreatePost) {
              onclickCreatePosts();
            }
          }}
        />
      </div>
    </div>
  );
};

CustomCreatePost.modules = {
  toolbar: [["bold", "italic", "underline"]],
  clipboard: {
    matchVisual: false,
  },
};

CustomCreatePost.formats = ["bold", "italic", "underline"];

CustomCreatePost.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

export default CustomCreatePost;
