import React, { useEffect, useRef, useState } from "react";
import {
  createPostAPI,
  getPostDetailByIdAPI,
  updatePostAPI,
} from "../../services/postService";
import CustomCreatePost from "../CustomCreatePost";
import TextInput from "../TextInput";
import ReactQuill from "react-quill";
import CustomButton from "../CustomButton";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loading from "../Loading";
import { useLocation } from "react-router-dom";
import {
  createDocumentAPI,
  getDocumentDetailByIdAPI,
  getDocumentUnApprovedDetailByIdAPI,
  updateDocumentAPI,
} from "../../services/documentService";

const EditDocumentModal = ({
  openModal,
  setOpenModal,
  addDocument,
  documentId,
  deleteDocument,
}) => {
  const auth = useSelector((state) => state.auth);
  const [document, setDocument] = useState();
  const [content, setContent] = useState("");
  const [loadCreateDocument, setLoadCreateDocument] = useState(false);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState();
  const quillRef = useRef();
  const location = useLocation();

  useEffect(() => {
    if (openModal && documentId) {
      getData();
    }
  }, [openModal, documentId]);

  useEffect(() => {
    if (document) {
      setTitle(document?.title);
      setContent(document?.content);
      setFiles(document?.files[0]);
    }
  }, [document]);

  const getData = async () => {
    const data = await getDocumentUnApprovedDetailByIdAPI(documentId);
    setDocument(data?.data);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFileUpload = (e) => {
    const selectedFiles = e.target.files[0];
    setFiles(selectedFiles);
  };

  const onclickUpdateDocuments = async () => {
    if (!title) {
      return toast.error("Tiêu đề không được bỏ trống!");
    } else if (!content) {
      return toast.error("Nội dung không được bỏ trống!");
    } else if (!files) {
      return toast.error("Hãy thêm file tài liệu!");
    } else {
      setLoadCreateDocument(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("documentId", documentId);
      if (files?._id) {
        formData.append("fileOld", files?._id);
      } else {
        formData.append("files", files);
      }

      try {
        await toast.promise(updateDocumentAPI(formData), {
          loading: "Tài liệu đang được sửa...",
          success: (data) => {
            if (auth.isAdmin) {
              if (location.pathname === "/tai-lieu") {
                deleteDocument(documentId);
                addDocument(data?.data);
              }
            } else {
              if (location.pathname === "/tai-lieu/chua-duyet") {
                deleteDocument(documentId);
                addDocument(data?.data);
              } else {
                deleteDocument(documentId);
              }
            }
            setTitle("");
            setContent("");
            setFiles([]);

            handleCloseModal();
            return data?.message;
          },
          error: (error) => {
            return error?.message;
          },
        });
      } catch (error) {}

      setLoadCreateDocument(false);
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
                  Chỉnh sửa tài liệu
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
                  type="text"
                  styles="w-full"
                  placeholder="Tiêu đề tài liệu...."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  formats={EditDocumentModal.formats}
                  modules={EditDocumentModal.modules}
                  placeholder="Nội dung tài liệu..."
                />

                <div className="flex gap-3 items-center my-3">
                  {/* Thêm files */}
                  <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf, .doc, .docx"
                    />
                    <i className="fa-solid fa-upload"></i>
                    <span>Thêm tệp</span>
                  </label>
                </div>

                {/* Hiển thị danh sách các tệpflex flex-wrap */}
                <div className="my-2 mt-5">
                  {/* Hiển thị cả các tệp đã có và các tệp mới được thêm */}
                  {files && (
                    <div className="relative">
                      <a
                        href={
                          files?._id
                            ? `http://localhost:3001/${files?.path}`
                            : URL.createObjectURL(files)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {files?.name}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* footer */}
              <div className="relative p-4 md:p-5 border rounded-t flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onclickUpdateDocuments();
                  }}
                  className="px-4 py-2 text-black hover:bg-teal-300 hover:text-gray-900 rounded-lg focus:outline-none border bg-teal-500"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

EditDocumentModal.modules = {
  toolbar: [["bold", "italic", "underline"]],
  clipboard: {
    matchVisual: false,
  },
};

EditDocumentModal.formats = ["bold", "italic", "underline"];

export default EditDocumentModal;
