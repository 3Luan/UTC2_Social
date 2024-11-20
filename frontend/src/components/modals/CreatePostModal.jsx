import React, { useEffect, useRef, useState } from "react";
import {
  createPostAPI,
  getPostDetailByIdAPI,
  updatePostAPI,
} from "../../services/postService";
import TextInput from "../TextInput";
import ReactQuill from "react-quill";
import CustomButton from "../CustomButton";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loading from "../Loading";
import { useLocation } from "react-router-dom";

const CreatePostModal = ({ openModal, setOpenModal, addPost }) => {
  const auth = useSelector((state) => state.auth);
  const [post, setPost] = useState();
  const [content, setContent] = useState("");
  const [loadCreatePost, setLoadCreatePost] = useState(false);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const quillRef = useRef();
  const location = useLocation();

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleImageUpload = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length + images.length > 10) {
      toast.error("Chỉ có thể tải lên tối đa 10 ảnh.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 10) {
      toast.error("Chỉ có thể tải lên tối đa 10 tệp.");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const onclickCreatePosts = async () => {
    if (!title) {
      return toast.error("Tiêu đề không được bỏ trống!");
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
            if (auth.isAdmin) {
              if (location.pathname === "/community") {
                addPost(data?.data?.post);
              }
            } else {
              if (location.pathname === "/community/unapproved") {
                addPost(data?.data?.post);
              }
            }
            setTitle("");
            setContent("");
            setImages([]);
            setFiles([]);
            handleCloseModal();
            return data.message;
          },
          error: (error) => {
            return error?.data?.message;
          },
        });
      } catch (error) {}

      setLoadCreatePost(false);
    }
  };

  return (
    <>
      {openModal && (
        <>
          <div className="pt-20 fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div
              id="static-modal"
              data-modal-backdrop="static"
              tabIndex="-1"
              aria-hidden="true"
              className="relative z-50 w-full max-w-2xl overflow-y-auto bg-white rounded-lg shadow-lg"
            >
              {/* Modal content */}
              <div className="relative p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl text-center font-semibold text-gray-900">
                  Tạo bài viết
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="absolute top-0 right-0 px-4 py-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg focus:outline-none"
                >
                  <i className="fa-solid fa-x"></i>
                </button>
              </div>
              <div className="bg-white px-4 rounded-lg my-2">
                <TextInput
                  name="title"
                  type="text"
                  styles="w-full"
                  placeholder="Tiêu đề bài viết...."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <ReactQuill
                  id="content"
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  formats={CreatePostModal.formats}
                  modules={CreatePostModal.modules}
                  placeholder="Nội dung bài viết..."
                />

                <div className="flex gap-3 items-center my-3">
                  {/* Thêm ảnh */}
                  <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      accept=".jpg, .png, .jpeg, image/*"
                      multiple
                    />
                    <i className="fa-solid fa-image"></i>
                    <span>Thêm ảnh</span>
                  </label>

                  {/* Thêm files */}
                  <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf, .doc, .docx"
                      multiple
                    />
                    <i className="fa-solid fa-upload"></i>
                    <span>Thêm tệp</span>
                  </label>
                </div>

                {/* Hiển thị danh sách hình ảnh */}
                <div className="flex flex-wrap gap-1">
                  {/* Hiển thị cả ảnh đã có và ảnh mới được thêm */}
                  {images.map((image, index) => {
                    return (
                      <div key={index} className="relative">
                        <img
                          src={
                            image._id
                              ? `${process.env.REACT_APP_URL_BACKEND}/${image.path}`
                              : URL.createObjectURL(image)
                          }
                          alt={`Image ${index}`}
                          className="w-auto h-32 rounded"
                        />
                        {/* <div className="text-center">{image.name}</div> */}
                        <button
                          type="button"
                          className="absolute top-0 right-0 px-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <i className="fa-solid fa-x"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Hiển thị danh sách các tệpflex flex-wrap */}
                <div className="my-2 mt-5">
                  {/* Hiển thị cả các tệp đã có và các tệp mới được thêm */}
                  {files.map((file, index) => (
                    <>
                      <div key={index} className="relative">
                        <a
                          href={
                            file._id
                              ? `${process.env.REACT_APP_URL_BACKEND}/${file.path}`
                              : URL.createObjectURL(file)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.name}
                        </a>
                        <button
                          type="button"
                          className="absolute top-0 right-0 px-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <i className="fa-solid fa-x"></i>
                        </button>
                      </div>
                    </>
                  ))}
                </div>
              </div>

              {/* footer */}
              <div className="relative p-4 md:p-5 border rounded-t flex justify-end">
                <button
                  id="btn_dangbai"
                  type="button"
                  onClick={() => {
                    onclickCreatePosts();
                  }}
                  className="px-4 py-2 text-black hover:bg-teal-300 hover:text-gray-900 rounded-lg focus:outline-none border bg-teal-500"
                >
                  Đăng bài
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

CreatePostModal.modules = {
  toolbar: [["bold", "italic", "underline"]],
  clipboard: {
    matchVisual: false,
  },
};

CreatePostModal.formats = ["bold", "italic", "underline"];

export default CreatePostModal;
