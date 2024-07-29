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
        <div className="">
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
          <button className="ml-3">
            <Send />
          </button>
          {/* <button className="ml-3"><MapsUgcRounded/></button> */}
        </div>
        <button
          onClick={
            saved
              ? () => savePost({ postId: post?._id, reqType: "unsave" })
              : () => savePost({ postId: post?._id, reqType: "save" })
          }
          disabled={pendingSave}
        >
          {saved ? (
            <Bookmark
              className={`${pendingSave ? "opacity-50" : "opacity-100"}`}
            />
          ) : (
            <BookmarkBorder
              className={`${pendingSave ? "opacity-50" : "opacity-100"}`}
            />
          )}
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
