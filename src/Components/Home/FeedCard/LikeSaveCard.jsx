import PropTypes from "prop-types";

import useLikePost from "../../UI/PostCard/LikeSave/useLikePost";
import useSavePost from "../../UI/PostCard/LikeSave/useSavePost";

import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Send,
  Pending,
} from "@mui/icons-material";

const LikeSaveCard = ({ post }) => {
  const {
    liked,
    likesCount,
    likePost,
    isPending: pendingLike,
  } = useLikePost(post);
  const { saved, savePost, isPending: pendingSave } = useSavePost(post);

  return (
    <>
      <div className="w-full flex justify-between my-2">
        <div className="flex items-center gap-4">
          <button
            onClick={
              liked
                ? () => likePost({ postId: post?._id, reqType: "unlike" })
                : () => likePost({ postId: post?._id, reqType: "like" })
            }
            disabled={pendingLike}
            className="group focus:outline-none transition-transform active:scale-90"
          >
            {liked ? (
              <Favorite
                className={`text-red-500 drop-shadow-sm ${pendingLike ? "opacity-50" : "opacity-100"
                  } group-hover:scale-110 transition-transform duration-500 ease-out`}
                fontSize="medium"
              />
            ) : (
              <FavoriteBorder
                className={`text-slate-600 dark:text-slate-400 group-hover:text-red-500 ${pendingLike ? "opacity-50" : "opacity-100"
                  } group-hover:scale-110 transition-all duration-500 ease-out`}
                fontSize="medium"
              />
            )}
          </button>
          <button className="group focus:outline-none transition-transform active:scale-90">
            <Send className="text-slate-600 dark:text-slate-400 group-hover:text-blue-500 -rotate-45 mb-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 ease-out" fontSize="medium" />
          </button>
        </div>
        <button
          onClick={
            saved
              ? () => savePost({ postId: post?._id, reqType: "unsave" })
              : () => savePost({ postId: post?._id, reqType: "save" })
          }
          disabled={pendingSave}
          className="group focus:outline-none transition-transform active:scale-90"
        >
          {saved ? (
            <Bookmark
              className={`text-accent drop-shadow-sm ${pendingSave ? "opacity-50" : "opacity-100"} group-hover:scale-110 transition-transform duration-200`}
              fontSize="medium"
            />
          ) : (
            <BookmarkBorder
              className={`text-slate-400 dark:text-slate-500 group-hover:text-accent ${pendingSave ? "opacity-50" : "opacity-100"} group-hover:scale-110 transition-all duration-200`}
              fontSize="medium"
            />
          )}
        </button>
      </div>
      {likesCount > 0 && <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{`${likesCount} likes`}</p>}
    </>
  );
};

export default LikeSaveCard;

LikeSaveCard.propTypes = {
  post: PropTypes.object.isRequired,
};
