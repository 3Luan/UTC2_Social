import React, { useEffect, useState } from "react";
import TextInput from "../TextInput";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileAPI } from "../../services/userService";
import { handleUpdateProfile } from "../../redux/auth/authAction";
import { getCoursesAPI } from "../../services/documentCourseService";

const EditProfileModal = ({ openModal, setOpenModal }) => {
  const auth = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [pic, setPic] = useState("");
  const [picUrl, setPicUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [courseSelect, setCourseSelect] = useState("");

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

  useEffect(() => {
    dispatch(handleUpdateProfile());

    if (auth) {
      setName(auth?.name);
      setGender(auth?.gender);
      setCourseSelect(auth?.course);
      const date = new Date(auth.birth);
      const formattedBirth = date.toISOString().split("T")[0];
      setBirth(formattedBirth);
      setPicUrl(
        auth?.pic?.includes("googleusercontent.com")
          ? auth?.pic
          : `${process.env.REACT_APP_URL_BACKEND}/${auth?.pic}`
      );
    }
  }, [auth]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Hàm xử lý khi người dùng chọn ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const picURL = URL.createObjectURL(file);
      setPic(file);
      setPicUrl(picURL);
    } else {
      setPic(null);
      setPicUrl(
        auth?.pic?.includes("googleusercontent.com")
          ? auth?.pic
          : `${process.env.REACT_APP_URL_BACKEND}/${auth?.pic}`
      );
    }
  };

  // Hàm xử lý khi người dùng lưu thông tin chỉnh sửa
  const handleSaveProfile = async () => {
    if (!name || !gender || !birth || !courseSelect) {
      toast.error("Thông tin không được bỏ trống!");
      return;
    }
    if (!pic && !picUrl) {
      toast.error("Hãy thêm ảnh đại diện!");
      return;
    }
    if (!["male", "female", "other"].includes(gender)) {
      toast.error("Giới tính không hợp lệ!");
      return;
    }
    const currentDate = new Date().toISOString().split("T")[0];
    if (birth > currentDate) {
      toast.error("Ngày sinh không hợp lệ!");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("birth", birth);
    formData.append("courseId", courseSelect);

    if (pic) {
      formData.append("pic", pic);
    } else {
      formData.append("picOld", picUrl);
    }
    try {
      await toast.promise(updateProfileAPI(formData), {
        loading: "Đang cập nhật...",
        success: (data) => {
          dispatch(handleUpdateProfile());
          setOpenModal(false);
          return data.message;
        },
        error: (error) => {
          return error?.data?.message || "Có lỗi xảy ra!";
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative w-1/3 max-w-2xl overflow-y-auto bg-white rounded-lg shadow-lg">
            <div className="relative p-4 md:p-5 rounded-t">
              <h3 className="absolute left-3 top-0 text-xl py-2 text-center font-bold text-gray-900">
                Chỉnh sửa thông tin cá nhân
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-0 right-0 px-4 py-2 text-gray-400 hover:text-gray-900 rounded-lg focus:outline-none"
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            <div className="bg-white px-4 rounded-lg my-2">
              {/* Hiển thị ảnh đại diện */}
              <p className="ml-1 mt-8 font-bold">Đổi ảnh đại diện</p>
              <div className="flex justify-center items-center my-4">
                <div className="flex items-center justify-between w-full bg-gray-200 rounded-2xl">
                  <img
                    src={picUrl}
                    alt="Avatar"
                    className="h-20 w-20 rounded-full object-cover p-3"
                  />
                  <label for="avatar" className=" cursor-pointer p-3">
                    <i className="bg-blue-500 rounded-lg p-2 text-white font-bold not-italic text-sm">
                      Chọn ảnh đại diện
                    </i>
                  </label>
                </div>

                <input
                  type="file"
                  id="avatar"
                  accept=".jpg, .png, .jpeg, image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              {/* Hiển thị tên người dùng */}
              <p className="ml-1 mt-8 font-bold">Đổi tên người dùng</p>
              <TextInput
                type="text"
                styles="w-full rounded-xl border-none bg-gray-200"
                placeholder="Nhập tên...."
                value={name}
                onChange={handleNameChange}
              />

              <div className="w-full pt-5">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giới tính
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="p-3 border  block w-full pl-3 pr-10  text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>
                    Giới tính
                  </option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <TextInput
                name="dateOfBirth"
                label="Ngày sinh"
                placeholder="Date of Birth"
                type="date"
                styles="w-full"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
              <div className="w-full pt-5">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Khóa học
                </label>
                <select
                  id="course"
                  name="course"
                  className="p-3 border  block w-full pl-3 pr-10  text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={courseSelect}
                  onChange={(e) => setCourseSelect(e.target.value)}
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
            </div>
            <div className="relative p-4 md:p-5 rounded-t flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-black hover:bg-gray-200 hover:text-gray-900 rounded-lg focus:outline-none mr-2 border-black font-bold"
              >
                Đóng
              </button>
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

export default EditProfileModal;
