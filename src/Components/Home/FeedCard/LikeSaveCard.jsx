import PropTypes from "prop-types";

import useLikePost from "../../UI/PostCard/LikeSave/useLikePost";
import useSavePost from "../../UI/PostCard/LikeSave/useSavePost";

import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Send,
} from "@mui/icons-material";

const LikeSaveCard = ({ post }) => {
  const { liked, likesCount, likePost } = useLikePost(post);
  const { saved, savePost } = useSavePost(post);

  return (
    <>
      <div className="w-full flex justify-between my-2">
        <div className="">
          <button
            onClick={
              liked
                ? () => likePost(post?._id, "unlike")
                : () => likePost(post?._id, "like")
            }
          >
            {liked ? <Favorite className="text-red-600" /> : <FavoriteBorder />}
          </button>
          <button className="ml-3">
            <Send />
          </button>
          {/* <button className="ml-3"><MapsUgcRounded/></button> */}
        </div>
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
      {likesCount > 0 && <p>{`${likesCount} likes`}</p>}
    </>
  );
};

export default LikeSaveCard;

LikeSaveCard.propTypes = {
  post: PropTypes.object.isRequired,
};
