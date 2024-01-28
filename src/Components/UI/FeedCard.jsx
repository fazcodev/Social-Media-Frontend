import { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { likePost, savePost } from "../Helpers/sendRequest";
import Modal from "./Modal";
import {
  FavoriteBorder,
  Favorite,
  Send,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import CommentSection from "./CommentSection";
import defaultAvatar from "../Assets/Default_Avatar.png";

const FeedCard = forwardRef((props, ref) => {
  const [openPostModal, setOpenPostModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState(props.post.commentsCount);
  const [likesCount, setLikesCount] = useState(props.post.likesCount);
  const [readMore, setReadMore] = useState(false);
  const [liked, setLiked] = useState(props.post.isLiked);
  const [saved, setSaved] = useState(props.post.isSaved);
  const navigate = useNavigate();

  return (
    <>
      {openPostModal && (
        <Modal
          post={props.post}
          title="View Post"
          liked={liked}
          setLiked={setLiked}
          likesCount={likesCount}
          setLikesCount={setLikesCount}
          openModalHandler={setOpenPostModal}
        />
      )}
      <div
        ref={ref}
        className="w-1/2 mmd:w-2/3 mtiny:w-4/5 mx-auto text-left my-5 border-b border-stone-300"
      >
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden object-center">
            <img
              className="bg-cover aspect-square"
              src={
                props.post.owner.avatarURL
                  ? props.post.owner.avatarURL
                  : defaultAvatar
              }
              alt="avatar"
            />
          </div>
          <div
            onClick={() =>
              navigate(`/profile/users/${props.post.owner.username}`)
            }
            className="ml-2 font-bold hover:underline cursor-pointer"
          >
            {props.post.owner.username}
          </div>
        </div>
        <div>
          <img
            className="w-full bg-cover"
            src={props.post.imageUrl}
            alt="post"
          />
        </div>
        <div className="w-full flex justify-between my-2">
          <div className="">
            <button
              onClick={
                liked
                  ? () =>
                      likePost(
                        setLiked,
                        setLikesCount,
                        props.post._id,
                        "unlike"
                      )
                  : () =>
                      likePost(setLiked, setLikesCount, props.post._id, "like")
              }
            >
              {liked ? (
                <Favorite className="text-red-600" />
              ) : (
                <FavoriteBorder />
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
                ? () => savePost(setSaved, props.post._id, "unsave")
                : () => savePost(setSaved, props.post._id, "save")
            }
          >
            {saved ? <Bookmark /> : <BookmarkBorder />}
          </button>
        </div>

        {props.post.likesCount > 0 && <p>{`${props.post.likesCount} likes`}</p>}
        <div className="">
          {!readMore && <span>{props.post.description.substring(0, 50)}</span>}
          {readMore && <span>{`${props.post.description} `}</span>}
          {readMore && (
            <button
              onClick={() => setReadMore(false)}
              className="text-blue-500 hover:underline"
            >
              view less
            </button>
          )}
          {props.post.description.length > 50 && !readMore && (
            <button
              onClick={() => setReadMore(true)}
              className="text-blue-500 hover:underline"
            >
              ...read more
            </button>
          )}
        </div>
        {commentsCount >= 0 && (
          <button
            className="text-blue-500"
            onClick={() => setOpenPostModal(true)}
          >
            View all{" "}
            <span className="text-black">{` ${commentsCount} comments`}</span>
          </button>
        )}
        <CommentSection
          setCount={setCommentsCount}
          comment={true}
          class="flex"
          post={props.post}
        />
      </div>
    </>
  );
});
FeedCard.displayName = "FeedCard";
export default FeedCard;
