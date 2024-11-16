import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import logo_utc2 from "../assets/logo_utc2.png";

const PostCardUTC2 = ({ post, link }) => {
  moment.locale("vi");

  return (
    <Link to={`/${link}/${post.id}`}>
      <div className="mb-2 bg-white p-4 rounded-xl">
        <div className="flex gap-3 items-center mb-2">
          <img
            src={post.image ? `https://utc2.edu.vn${post.image}` : logo_utc2}
            alt="img"
            className="w-14 h-14 object-cover rounded-full"
          />

          <div className="w-full flex justify-between">
            <div className="">
              <p className="font-medium text-lg text-ascent-1">{post.title}</p>
              <span className="text-ascent-2">
                {moment(post.updated_at).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCardUTC2;
