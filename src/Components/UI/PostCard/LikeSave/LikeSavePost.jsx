import useLikePost from "./useLikePost";
import useSavePost from "./useSavePost";
import PropTypes from "prop-types";
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";

const LikeSavePost = ({post, liked, likePost, pendingLike }) => {
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
      >
        {liked ? (
          <Favorite
            className={`text-red-600 ${
              pendingLike ? "opacity-50" : "opacity-100"
            }`}
          />
        ) : (
          <FavoriteBorder
            className={`${pendingLike ? "opacity-50" : "opacity-100"}`}
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
      >
        {saved ? (
          <Bookmark className={`${pendingSave ? "opacity-50" : "opacity-100"}`} />
        ) : (
          <BookmarkBorder
            className={`${pendingSave ? "opacity-50" : "opacity-100"}`}
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
