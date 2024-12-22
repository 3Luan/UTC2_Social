import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { useEffect, useRef, useState } from "react";

const PostCardAdmin = ({ post, link }) => {
  moment.locale("vi");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [pic, setPic] = useState();

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
      post?.user?.pic?.includes("googleusercontent.com")
        ? post?.user?.pic
        : `http://localhost:3001/${post?.user?.pic}`
    );
  }, [post?.user?.pic]);

  return (
    <div className="bg-white rounded-xl border-b flex ">
      <div className="flex justify-between items-start w-full max-h-38  ">
        <Link to={`${link}/${post._id}`}>
          <div className="my-2 bg-white mx-4 py-1 w-full pr-60">
            <div className="flex gap-3 items-center mb-2">
              <div className="flex flex-col">
                <div className="flex items-start">
                  <img className="w-10 h-10 rounded-full" src={pic} alt="" />
                  <div className="flex flex-col justify-start ml-2">
                    <p className="text-sm font-semibold">{post?.user?.name}</p>
                    <span className="text-xs text-gray-500">
                      {moment(post.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <p className="font-medium text-lg text-ascent-1 text-blue-600 ml-1 my-2">
                  {post.title}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostCardAdmin;
