import useLikePost from "./useLikePost";
import useSavePost from "./useSavePost";
import PropTypes from "prop-types";
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";

const LikeSavePost = ({ post, liked, likePost, pendingLike }) => {
  // const { liked, likePost, isPending: pendingLike } = useLikePost(post);
  const { saved, savePost, isPending: pendingSave } = useSavePost(post);

  return (
    <div className="flex justify-start gap-2 px-1 py-1.5">
      <button
        onClick={
          liked
            ? () => likePost({ postId: post?._id, reqType: "unlike" })
            : () => likePost({ postId: post?._id, reqType: "like" })
        }
        disabled={pendingLike}
        className="transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        {liked ? (
          <Favorite
            className={`text-red-500 ${pendingLike ? "opacity-50" : "opacity-100"
              }`}
          />
        ) : (
          <FavoriteBorder
            className={`text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ${pendingLike ? "opacity-50" : "opacity-100"}`}
          />
        )}
      </button>
      <button
        onClick={
          saved
            ? () => savePost({ postId: post?._id, reqType: "unsave" })
            : () => savePost({ postId: post?._id, reqType: "save" })
        }
        disabled={pendingSave}
        className="transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        {saved ? (
          <Bookmark className={`text-slate-800 dark:text-slate-200 ${pendingSave ? "opacity-50" : "opacity-100"}`} />
        ) : (
          <BookmarkBorder
            className={`text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-cyan-400 transition-colors ${pendingSave ? "opacity-50" : "opacity-100"}`}
          />
        )}
      </button>
    </div>
  );
};

export default LikeSavePost;

LikeSavePost.propTypes = {
  post: PropTypes.object,
};
