import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditProfileModal from "../modals/EditProfileModal";
import { handleUpdateProfile } from "../../redux/auth/authAction";
import { handlegetHistoryPosts } from "../../redux/post/postAction";
import PostCard from "../PostCard";
import CustomPagination from "../CustomCustomPagination";
import Loading from "../Loading";
import moment from "moment";
import "moment/locale/vi";
import EditPasswordModal from "../modals/EditPasswordModal";
import { getCoursesAPI } from "../../services/documentCourseService";

const MyProfile = ({ data }) => {
  moment.locale("vi");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [pic, setPic] = useState("");
  const [openModalUpdateProfile, setOpenModalUpdateProfile] = useState(false);
  const [openModalUpdatePassword, setOpenModalUpdatePassword] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const post = useSelector((state) => state.post);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [count, setCount] = useState();
  const [img, setImg] = useState("");
  const [courses, setCourses] = useState([]);
  const [nameCourse, setNameCourse] = useState("");

  const getCourse = async () => {
    try {
      let data = await getCoursesAPI();
      setCourses(data?.data);
    } catch (error) {
      setCourses([]);
    }
  };

  useEffect(() => {
    getCourseById();
  }, [courses, auth]);

  const getCourseById = () => {
    const course = courses.find((course) => course._id === auth?.course);
    if (course) {
      setNameCourse(course.name);
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  const addPost = (data) => {
    setPosts((posts) => [data, ...posts]);
  };

  const deletePost = (postId) => {
    setPosts((posts) => posts.filter((post) => post?._id !== postId));
  };

  useEffect(() => {
    dispatch(handlegetHistoryPosts());
  }, []);

  useEffect(() => {
    if (post.posts && !post.isLoading) {
      setPosts(post?.posts);
      setCount(post?.count);
    }
  }, [post]);

  const onclickShowModal = () => {
    setOpenModalUpdateProfile(true);
  };

  const onclickShowModalEditPassword = () => {
    setOpenModalUpdatePassword(true);
  };

  useEffect(() => {
    dispatch(handleUpdateProfile());
    setName(auth?.name);
    setGender(auth?.gender);
    setBirth(auth?.birth);
    setPic(auth?.pic);
  }, [auth?.name, auth?.pic, auth?.gender, auth?.birth]);

  useEffect(() => {
    setImg(
      auth?.pic?.includes("googleusercontent.com")
        ? auth?.pic
        : `http://localhost:3001/${auth?.pic}`
    );
  }, [auth?.pic]);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);

    dispatch(handlegetHistoryPosts(selectedPage.selected + 1));
  };

  return (
    <div className="flex-1 h-full flex flex-col gap-2 overflow-y-auto rounded-lg bg-white">
      <div className="w-full h-48 flex pt-4 pb-4 border-b bg-white duration-200 easy-in-out">
        <div className="flex justify-center px-5  ">
          <img
            className="h-36 w-36 bg-white p-2 rounded-full"
            src={img}
            alt=""
          />
        </div>
        <div>
          <div className="pl-4">
            <h2 className="text-gray-800 text-xl font-bold">
              {name}{" "}
              {auth?.isAdmin && <i className="fa-solid fa-circle-check"></i>}
            </h2>
          </div>
          <div className="pl-4 pt-1">
            <h2 className="text-gray-500 text-sm">
              {gender === "male" ? (
                <>Nam</>
              ) : gender === "female" ? (
                <>Nữ</>
              ) : (
                <>Khác</>
              )}{" "}
              • {moment(birth).format("L")} • Sinh viên {nameCourse}
            </h2>
          </div>
          <div className="flex bg-transparent my-2">
            <div className="text-center p-4 pt-2 cursor-pointer">
              <p>
                <span className="font-semibold">{data?.countFollowers}</span>{" "}
                Followers
              </p>
            </div>

            <div className="text-center p-4 pt-2 cursor-pointer">
              <p>
                {" "}
                <span className="font-semibold">
                  {data?.countFollowings}
                </span>{" "}
                Following
              </p>
            </div>
          </div>

          <div className="flex">
            <div
              className="text-center w-48 p-2 ml-4 cursor-pointer rounded-xl bg-gray-200 text-black font-bold text-sm"
              onClick={() => {
                onclickShowModal();
              }}
            >
              <p className="">
                <i className="fa-solid fa-pen-to-square"></i> Chỉnh sửa thông
                tin
              </p>
            </div>

            <div
              className="text-center w-48 p-2 ml-4 cursor-pointer rounded-xl bg-gray-200 text-black font-bold text-sm"
              onClick={() => {
                onclickShowModalEditPassword();
              }}
            >
              <p className="">
                <i className="fa-solid fa-pen-to-square"></i> Đổi mật khẩu
              </p>
            </div>
          </div>
        </div>
      </div>

      {post.isLoading ? (
        <Loading />
      ) : posts.length > 0 ? (
        <>
          {posts.map((item) => (
            <>
              <PostCard
                key={item?.id}
                post={item}
                deletePost={deletePost}
                addPost={addPost}
                link={"/community/post"}
              />
            </>
          ))}
          <div className="flex justify-center mb-10">
            <CustomPagination
              nextLabel=">"
              onPageChange={handlePageClick}
              pageCount={Math.ceil(count / 10)}
              previousLabel="<"
              currentPage={currentPage}
            />
          </div>
        </>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <p className="text-lg text-ascent-2">Không tìm thấy bài viết nào</p>
        </div>
      )}
      {openModalUpdateProfile && (
        <EditProfileModal
          openModal={openModalUpdateProfile}
          setOpenModal={setOpenModalUpdateProfile}
        />
      )}

      {openModalUpdatePassword && (
        <EditPasswordModal
          openModal={openModalUpdatePassword}
          setOpenModal={setOpenModalUpdatePassword}
        />
      )}
    </div>
  );
};

export default MyProfile;
