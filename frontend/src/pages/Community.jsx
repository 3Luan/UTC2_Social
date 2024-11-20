import Header from "../components/Header";
import FiltersCard from "../components/FiltersCard";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import CustomCreatePost from "../components/CustomCreatePost";
import {
  handleGetPosts,
  handleGetUnapprovedPosts,
  handlegetHistoryPosts,
} from "../redux/post/postAction";
import PostCard from "../components/PostCard";
import CustomPagination from "../components/CustomCustomPagination";
import NavBarComunity from "../components/NavBarCommunity";
import { useLocation } from "react-router-dom";
import {
  getHistoryPostsAPI,
  getPostsAPI,
  getUnapprovedPostsAPI,
  searchHistoryPostAPI,
  searchPostAPI,
  searchUnapprovedPostAPI,
} from "../services/postService";

const Community = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post);
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [isSearch, setIsSearch] = useState(false);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addPost = (data) => {
    setPosts((posts) => [data, ...posts]);
  };

  const deletePost = (postId) => {
    setPosts((posts) => posts.filter((post) => post?._id !== postId));
  };

  useEffect(() => {
    console.log("location.pathname", location.pathname);

    if (location.pathname === "/community/unapproved") {
      dispatch(handleGetUnapprovedPosts());
    } else if (location.pathname === "/community/history") {
      dispatch(handlegetHistoryPosts());
    } else if (location.pathname === "/community") {
      dispatch(handleGetPosts());
    }
  }, [location.pathname]);

  useEffect(() => {
    if (post?.posts && !post?.isLoading) {
      setPosts(post?.posts);
      setCount(post?.count);
    }
  }, [post]);

  const handlePageClick = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    setIsLoading(true);

    try {
      let data;
      if (location.pathname === "/community") {
        data = query
          ? await searchPostAPI(selectedPage.selected + 1, query)
          : (data = await getPostsAPI(selectedPage.selected + 1));
      } else if (location.pathname === "/community/unapproved") {
        data = query
          ? await searchUnapprovedPostAPI(selectedPage.selected + 1, query)
          : (data = await getUnapprovedPostsAPI(selectedPage.selected + 1));
      } else if (location.pathname === "/community/history") {
        console.log("setPosts", posts);

        data = query
          ? await searchHistoryPostAPI(selectedPage.selected + 1, query)
          : (data = await getHistoryPostsAPI(selectedPage.selected + 1));
      }

      setPosts(data?.data?.posts);
      setCount(data?.data?.count);
    } catch (error) {
      setPosts([]);
      setCount(0);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <Header />
      <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
        <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
          <Sidebar />
          <FiltersCard />
        </div>

        {/* CENTER */}
        <div className="w-1/2 h-full flex flex-col  overflow-y-auto rounded-lg bg-white">
          <>
            <NavBarComunity
              setQuery={setQuery}
              addPost={addPost}
              setPosts={setPosts}
              setCount={setCount}
              setCurrentPage={setCurrentPage}
              setIsLoading={setIsLoading}
            />

            {post?.isLoading || isLoading ? (
              <Loading />
            ) : posts.length > 0 ? (
              <>
                {posts.map((item) => (
                  <>
                    {location.pathname === "/community/unapproved" ? (
                      <>
                        <PostCard
                          key={item.id}
                          post={item}
                          deletePost={deletePost}
                          addPost={addPost}
                          link={"/bai-viet-chua-duyet"}
                        />
                      </>
                    ) : (
                      <>
                        <PostCard
                          key={item?.id}
                          post={item}
                          deletePost={deletePost}
                          addPost={addPost}
                          link={"/community/post"}
                        />
                      </>
                    )}
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
                <p className="text-lg text-ascent-2">
                  Không tìm thấy bài viết nào
                </p>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default Community;
