import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "moment/locale/vi";
import { useEffect, useState, useRef } from "react";
import CreateDocumentModal from "./modals/CreateDocumentModal";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import {
  filterDocumentAPI,
  filterHistoryDocumentAPI,
  filterUnapprovedDocumentAPI,
  getDocumentsAPI,
  getHistoryDocumentsAPI,
  getUnapprovedDocumentsAPI,
  searchDocumentAPI,
  searchHistoryDocumentAPI,
  searchUnApprovedDocumentAPI,
} from "../services/documentService";
import { getCategoriesAPI } from "../services/documentCategoryService";

const NavBarDocument = ({
  addDocument,
  setIsLoading,
  setDocuments,
  setQuery,
  setCount,
  setCurrentPage,
  setSelectedCategory,
  selectedCategory,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const auth = useSelector((state) => state.auth);
  const [openModalCreateDocument, setOpenModalCreateDocument] = useState(false);
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);

  const getCategory = async () => {
    try {
      let data = await getCategoriesAPI(1);

      setCategories(data?.data);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getData();
  }, [selectedCategory]);

  useEffect(() => {
    setKeyword("");
    getData();
  }, [location.pathname]);

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

  const onclickCreateDocument = () => {
    setMenuOpen(false);
    setOpenModalCreateDocument(true);
  };

  const getData = async () => {
    setIsLoading(true);
    setQuery(keyword);
    setCurrentPage(0);

    try {
      let data;

      if (selectedCategory) {
        if (location.pathname === "/tai-lieu") {
          data = await filterDocumentAPI(
            1,
            keyword ? keyword : "null",
            selectedCategory
          );
        } else if (location.pathname === "/tai-lieu/chua-duyet") {
          data = await filterUnapprovedDocumentAPI(
            1,
            keyword ? keyword : "null",
            selectedCategory
          );
        } else if (location.pathname === "/tai-lieu/lich-su") {
          data = await filterHistoryDocumentAPI(
            1,
            keyword ? keyword : "null",
            selectedCategory
          );
        }
      } else {
        if (location.pathname === "/tai-lieu") {
          data = keyword
            ? await searchDocumentAPI(1, keyword)
            : (data = await getDocumentsAPI(1));
        } else if (location.pathname === "/tai-lieu/chua-duyet") {
          data = keyword
            ? await searchUnApprovedDocumentAPI(1, keyword)
            : (data = await getUnapprovedDocumentsAPI(1));
        } else if (location.pathname === "/tai-lieu/lich-su") {
          data = keyword
            ? await searchHistoryDocumentAPI(1, keyword)
            : (data = await getHistoryDocumentsAPI(1));
        }
      }

      setDocuments(data?.data?.documents);
      setCount(data?.data?.count);
    } catch (error) {
      setDocuments([]);
      setCount(0);
    }
    setIsLoading(false);
  };

  const handleSearch = async (event) => {
    if (event?.key === "Enter" || !event?.key) {
      getData();
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="bg-white m-3 rounded-xl  flex flex-col items-center">
      <div className="flex justify-between w-full pb-4 border-b">
        <div ref={menuRef} className=" mt-2 bg-white rounded-md flex">
          <Link
            to="/tai-lieu"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 text-gray-800 leading-8 text-sm font-medium"
          >
            Các tài liệu
          </Link>
          {auth.auth && (
            <>
              <Link
                to="/tai-lieu/lich-su"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-gray-800 leading-8 text-sm font-medium"
              >
                Lịch sử
              </Link>
              <Link
                to="/tai-lieu/chua-duyet"
                className="block px-4 py-2 text-gray-800 leading-8 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Tài liệu chờ duyệt
              </Link>

              <button
                onClick={() => onclickCreateDocument()}
                className="block px-2 py-2 text-gray-800 text-sm font-medium"
                title="Thêm tài liệu"
              >
                <i class="fa-sharp fa-solid fa-circle-plus text-xl"></i>
              </button>

              <div>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className=" block w-24 ml-3 px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Tất cả</option>
                  {categories?.map((category) => (
                    <option key={category?._id} value={category?._id}>
                      {category?.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {openModalCreateDocument && (
          <CreateDocumentModal
            openModal={openModalCreateDocument}
            setOpenModal={setOpenModalCreateDocument}
            addDocument={addDocument}
          />
        )}
        <div className="flex items-center">
          <TextInput
            styles="mb-1 rounded-md border border-gray-200 text-gray-600 transition duration-300 ease-in"
            placeholder="Tìm kiếm tài liệu..."
            value={keyword}
            onKeyDown={handleSearch}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <CustomButton
            title={<i className="fa-solid fa-magnifying-glass"></i>}
            containerStyles={`bg-[#0444a4] text-white text-xl mt-1 py-3 px-4 rounded-md font-semibold text-sm`}
            onClick={() => handleSearch()}
          />
        </div>
      </div>
      <div className="text-2xl md:text-1xl font-bold text-center my-4 ml-2">
        {location.pathname === "/tai-lieu" ? (
          <>Tài liệu</>
        ) : location.pathname === "/tai-lieu/lich-su" ? (
          <>Tài liệu đã đăng</>
        ) : (
          <>Tài liệu chờ duyệt</>
        )}
      </div>
    </div>
  );
};
export default NavBarDocument;
