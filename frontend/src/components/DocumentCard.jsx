import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { useEffect, useRef, useState } from "react";
import {
  approvedDocumentAPI,
  deleteDocumentAPI,
} from "../services/documentService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import EditDocumentModal from "./modals/EditDocumentModal";

const DocumentCard = ({ doc, link, deleteDocument, addDocument }) => {
  moment.locale("vi");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [totalLike, setTotalLike] = useState(0);
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [openModalEditDocument, setOpenModalEditDocument] = useState(false);
  const [pic, setPic] = useState();

  useEffect(() => {
    setTotalLike(doc?.likes?.length);
  }, [doc?.likes]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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

  useEffect(() => {
    setPic(
      doc?.user?.pic?.includes("googleusercontent.com")
        ? doc?.user?.pic
        : `${process.env.REACT_APP_URL_BACKEND}/${doc?.user?.pic}`
    );
  }, [doc?.user?.pic]);

  const onclickApprovedDocument = async () => {
    setIsLoading(true);
    try {
      await toast.promise(approvedDocumentAPI(doc._id), {
        loading: "Đang duyệt...",
        success: (data) => {
          deleteDocument(doc._id);
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      });
    } catch (error) {}

    setMenuOpen(false);
    setIsLoading(false);
  };

  const onclickDeleteDocument = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmed) {
      setIsLoading(true);
      try {
        await toast.promise(deleteDocumentAPI(doc._id), {
          loading: "Đang xóa...",
          success: (data) => {
            deleteDocument(doc._id);
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

  const onclickEditDocument = () => {
    setMenuOpen(false);
    setOpenModalEditDocument(true);
  };

  return (
    <>
      <div className="bg-white border-b flex">
        <div className="flex justify-between items-start w-full max-h-38  ">
          <Link
            to={`${link}/${doc?._id}`}
            className="mx-5 pt-2 pb-4 bg-white mt-3 block border-b"
          >
            <div class="flex justify-between items-center">
              <div className="flex flex-col">
                <div class="flex items-start">
                  <img className="w-10 h-10 rounded-full" src={pic} alt="" />
                  <div className="flex flex-col justify-start ml-2">
                    <span class="text-sm font-semibold">{doc?.user?.name}</span>
                    <span class="text-xs text-gray-500">
                      {" "}
                      {moment(doc?.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <p className="font-medium text-lg text-ascent-1 text-blue-600 ml-1 my-2">
                  <a href="#">{doc?.title}</a>
                </p>
                <div class="flex mt-1">
                  <span className="text-sm text-gray-500 ml-1">
                    Lượt thích: {totalLike}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Button ellipsis */}
          {doc?.user?._id === auth?.id || auth?.isAdmin ? (
            <div className="flex flex-col items-end">
              <button className="px-3 rounded-md" onClick={toggleMenu}>
                <i className="fa-solid fa-ellipsis" />
              </button>

              {/* Menu */}
              {menuOpen && (
                <div
                  ref={menuRef}
                  className=" bg-white shadow-xl border rounded-md z-10 mr-2"
                >
                  {(location.pathname === "/tai-lieu/chua-duyet" ||
                    location.pathname === "/tai-lieu/chua-duyet/search") && (
                    <>
                      {auth?.isAdmin ? (
                        <>
                          <button
                            onClick={() => onclickApprovedDocument()}
                            className="block px-4 py-2 text-gray-800"
                          >
                            Duyệt
                          </button>

                          <button
                            className="block px-4 py-2 text-gray-800"
                            onClick={onclickDeleteDocument}
                          >
                            Xóa
                          </button>
                        </>
                      ) : (
                        <>
                          {doc?.user?._id === auth?.id && (
                            <>
                              <button
                                onClick={onclickEditDocument}
                                className="block px-4 py-2 text-gray-800"
                              >
                                Chỉnh sửa
                              </button>

                              <button
                                className="block px-4 py-2 text-gray-800"
                                onClick={onclickDeleteDocument}
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {(location.pathname === "/tai-lieu" ||
                    location.pathname === "/tai-lieu/search") && (
                    <>
                      {auth?.isAdmin ? (
                        <>
                          <button
                            className="block px-4 py-2 text-gray-800"
                            onClick={onclickDeleteDocument}
                          >
                            Xóa
                          </button>
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {openModalEditDocument && (
          <EditDocumentModal
            openModal={openModalEditDocument}
            setOpenModal={setOpenModalEditDocument}
            documentId={doc?._id}
            addDocument={addDocument}
            deleteDocument={deleteDocument}
          />
        )}
      </div>
    </>
  );
};

export default DocumentCard;
