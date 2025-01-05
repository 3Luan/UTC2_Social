import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { useEffect, useRef, useState } from "react";
import { deleteCategoryAPI } from "../../services/documentCategoryService";
import toast from "react-hot-toast";
import EditCategoryModal from "./EditCategoryModal";

const CategoryCard = ({ category, addCategory, deleteCategory }) => {
  moment.locale("vi");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const onclickDelete = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn ẩn?");
    if (confirmed) {
      setIsLoading(true);
      try {
        await toast.promise(deleteCategoryAPI(category?._id), {
          loading: "Đang ẩn...",
          success: (data) => {
            deleteCategory(category?._id);
            return data.message;
          },
          error: (error) => {
            return error.message;
          },
        });
      } catch (error) {}

      setMenuOpen(false);
      setIsLoading(false);
    }
  };

  const onclickEdit = () => {
    setMenuOpen(false);
    setOpenModalEdit(true);
  };

  return (
    <div className="bg-white rounded-xl border-b flex my-1">
      <div className="flex justify-between items-start w-full max-h-38  ">
        <div className="my-2 bg-white mx-4 py-1 w-full pr-60">
          <div className="flex gap-3 items-center mb-2">
            <div className="flex flex-col">
              <div className="flex items-start">
                <div className="flex flex-col justify-start ml-2">
                  <p className="text-xl font-semibold">{category?.name}</p>
                  {/* <span className="text-xs text-gray-500">
                    Trạng thái:{" "}
                    {category?.isActive ? "Đang hoạt động" : "Đã ẩn"}
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Button ellipsis */}
      <>
        <>
          <div className="flex flex-col items-end relative">
            <button className="px-3 rounded-md" onClick={toggleMenu}>
              <i className="fa-solid fa-ellipsis" />
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className=" bg-white shadow-xl border rounded-md z-10 mr-2 absolute w-32"
              >
                <>
                  <button
                    onClick={() => onclickEdit()}
                    className=" px-4 py-2 text-gray-800"
                  >
                    Chỉnh sửa
                  </button>
                </>

                <button
                  className=" px-4 py-2 text-gray-800"
                  onClick={() => onclickDelete()}
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        </>
      </>

      {openModalEdit && (
        <EditCategoryModal
          openModal={openModalEdit}
          setOpenModal={setOpenModalEdit}
          category={category}
          addCategory={addCategory}
          deleteCategory={deleteCategory}
        />
      )}
    </div>
  );
};

export default CategoryCard;
