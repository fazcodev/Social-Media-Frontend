import { forwardRef, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import defaultAvatar from "../../Assets/Default_Avatar.png";
import CardComments from "./CardComments";
import LikeSaveCard from "./LikeSaveCard";

const FeedCard = memo(
  forwardRef(function FeedCard({ post }, ref) {
    const [readMore, setReadMore] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => {
      navigate(`/profile/users/${post.owner.username}`);
    };

    const toggleReadMore = () => {
      setReadMore((prev) => !prev);
    };

    return (
      <div
        ref={ref}
        className="w-full bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border-2 border-white/50 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden"
      >
        <div className="p-4 flex items-center">
          <div
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full overflow-hidden object-center ring-2 ring-accent/20 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 cursor-pointer transition-all duration-300 hover:ring-accent/60 hover:ring-[3px]"
          >
            <img
              className="bg-cover aspect-square w-full h-full"
              src={post.owner.avatarURL || defaultAvatar}
              alt="avatar"
            />
          </div>
          <div
            onClick={handleProfileClick}
            className="ml-3 font-bold text-slate-900 dark:text-slate-100 hover:text-accent dark:hover:text-accent transition-colors cursor-pointer text-sm"
          >
            {post.owner.username}
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800/50 flex justify-center items-center">
          <img
            className="w-full h-auto object-contain max-h-[500px]"
            src={post.imageUrl}
            alt="post"
          />
        </div>

        <div className="p-4">
          <LikeSaveCard post={post} />

          <div className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {!readMore && <span>{post.description.substring(0, 90)}</span>}
            {readMore && <span>{`${post.description} `}</span>}
            {readMore && (
              <button
                onClick={toggleReadMore}
                className="text-accent hover:text-accent-dark ml-1 font-medium hover:underline"
              >
                show less
              </button>
            )}
            {post.description.length > 90 && !readMore && (
              <button
                onClick={toggleReadMore}
                className="text-accent hover:text-accent-dark ml-1 font-medium hover:underline"
              >
                ...more
              </button>
            )}
          </div>

          <div className="mt-3 border-t-2 border-slate-200 dark:border-slate-700/60 pt-3">
            <CardComments post={post} />
          </div>
        </div>
      </div>
    );
  })
);

export default FeedCard;

FeedCard.propTypes = {
  post: PropTypes.object.isRequired,
};
