import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import { getCategoriesAPI } from "../../services/documentCategoryService";
import CategoryCard from "../components/CategoryCard";
import CustomButton from "../../components/CustomButton";
import AddCategoryModal from "../components/AddCategoryModal";

const Category = ({}) => {
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const data = await getCategoriesAPI();
      setCategory(data?.data);
    } catch (error) {
      setCategory([]);
    }
    setIsLoading(false);
  };

  const addCategory = (data) => {
    setCategory((category) => [data, ...category]);
  };

  const deleteCategory = (categoryId) => {
    setCategory((category) => category.filter((c) => c?._id !== categoryId));
  };

  const onclickAdd = () => {
    setOpenModal(true);
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <HeaderAdmin />

      <div className="w-full flex gap-2 lg:gap-4  h-full">
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <SidebarAdmin />
        </div>

        {/* CENTER */}
        <div className="flex-1 h-full flex flex-col  overflow-y-auto pt-4">
          <div className="ml-2 mt-4 border-b pb-4">
            <CustomButton
              title="Thêm"
              containerStyles={`bg-[#0444a4] text-white text-lg mx-2 mt-1 py-3 px-4 rounded-md font-semibold text-sm`}
              onClick={onclickAdd}
            />
          </div>

          {isLoading ? (
            <Loading />
          ) : category?.length > 0 ? (
            <>
              {category?.map((item) => (
                <>
                  <CategoryCard
                    key={item._id}
                    category={item}
                    addCategory={addCategory}
                    deleteCategory={deleteCategory}
                  />
                </>
              ))}
            </>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">
                Không tìm thấy bài viết nào
              </p>
            </div>
          )}
        </div>
      </div>
      {openModal && (
        <AddCategoryModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          category={category}
          addCategory={addCategory}
          deleteCategory={deleteCategory}
        />
      )}
    </div>
  );
};

export default Category;
