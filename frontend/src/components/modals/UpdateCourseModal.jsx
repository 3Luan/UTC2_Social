import React, { useEffect, useState } from "react";
import TextInput from "../TextInput";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateCourseAPI, updateProfileAPI } from "../../services/userService";
import {
  handleRefresh,
  handleUpdateProfile,
} from "../../redux/auth/authAction";
import { getCoursesAPI } from "../../services/documentCourseService";

const UpdateCourseModal = ({ openModal, setOpenModal }) => {
  const auth = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [courseSelect, setCourseSelect] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getCourse = async () => {
    try {
      let data = await getCoursesAPI();

      setCourses(data?.data);
    } catch (error) {
      setCourses([]);
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  // Hàm xử lý khi người dùng lưu thông tin chỉnh sửa
  const handleSaveProfile = async () => {
    if (!courseSelect) {
      return toast.error("Hãy chọn ngành học của bạn");
    } else {
      setIsLoading(true);
      try {
        await toast.promise(updateCourseAPI(courseSelect), {
          loading: "Loading...",
          success: (data) => {
            dispatch(handleRefresh());

            return data.message;
          },
          error: (error) => {
            console.log("error", error);

            return error?.data?.message;
          },
        });
      } catch (error) {}
    }

    setIsLoading(false);
    setOpenModal(false);
  };

  const handleCourseChange = (event) => {
    setCourseSelect(event.target.value);
  };

  return (
    <>
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative w-1/5 max-w-2xl overflow-y-auto bg-white rounded-lg shadow-lg">
            <div className="relative p-4 md:p-5 rounded-t">
              <h3 className=" left-3 top-0 text-xl  text-center font-bold text-gray-900">
                Chọn ngành học của bạn
              </h3>
            </div>
            <div className="flex justify-center items-center ">
              <select
                value={courseSelect}
                onChange={handleCourseChange}
                className="block w-40 px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Chọn ngành học</option>
                {courses &&
                  courses.map((course) => (
                    <option key={course?._id} value={course?._id}>
                      {course?.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="relative p-4 md:p-5 rounded-t flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg p-2 text-white font-bold not-italic text-sm"
              >
                {isLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateCourseModal;
