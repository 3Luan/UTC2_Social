import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  getDocumentUnApprovedDetailByIdAPI,
  updateDocumentAPI,
} from "../../services/documentService";
import { editCategoryAPI } from "../../services/documentCategoryService";
import TextInput from "../../components/TextInput";

const EditCategoryModal = ({
  openModal,
  setOpenModal,
  category,
  deleteCategory,
  addCategory,
}) => {
  const [name, setName] = useState("");

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (category) {
      setName(category?.name);
    }
  }, []);

  const onclickEdit = async () => {
    if (!name) {
      return toast.error("Tên danh mục không được bỏ trống!");
    } else {
      try {
        await toast.promise(editCategoryAPI(category?._id, name), {
          loading: "Danh mục đang được sửa...",
          success: (data) => {
            deleteCategory(category?._id);
            addCategory(data?.data);

            handleCloseModal();
            return data?.message;
          },
          error: (error) => {
            return error?.data?.message;
          },
        });
      } catch (error) {}
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
                  Chỉnh sửa danh mục
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
                  placeholder="Tên danh mục"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            {/* footer */}
            <div className="relative p-4 md:p-5 border rounded-t flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onclickEdit();
                }}
                className="px-4 py-2 text-black hover:bg-teal-300 hover:text-gray-900 rounded-lg focus:outline-none border bg-teal-500"
              >
                Lưu
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EditCategoryModal;
