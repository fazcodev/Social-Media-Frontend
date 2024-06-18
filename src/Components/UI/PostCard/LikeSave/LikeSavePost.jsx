import useLikePost from "./useLikePost";
import useSavePost from "./useSavePost";
import PropTypes from "prop-types";
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";

const LikeSavePost = ({ post }) => {
  const { liked, likePost } = useLikePost(post);
  const { saved, savePost } = useSavePost(post);

  return (
    <div className="flex justify-start gap-2 px-1 py-1.5">
      <button
        onClick={
          liked
            ? () => likePost(post?._id, "unlike")
            : () => likePost(post?._id, "like")
        }
      >
        {liked ? <Favorite className="text-red-600" /> : <FavoriteBorder />}
      </button>
      <button
        onClick={
          saved
            ? () => savePost(post?._id, "unsave")
            : () => savePost(post?._id, "save")
        }
      >
        {saved ? <Bookmark /> : <BookmarkBorder />}
      </button>
    </div>
  );
};

export default LikeSavePost;

LikeSavePost.propTypes = {
  post: PropTypes.object,
};
