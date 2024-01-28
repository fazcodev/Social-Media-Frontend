import { useEffect, useState, useRef, useCallback } from "react";
import Moment from "react-moment";
import CommentSection from "./CommentSection";
import PropTypes from "prop-types";
import axios from "axios";
import { likePost, savePost } from "../Helpers/sendRequest";
import "../Image/ImageContainer.css";
import { BASE_URL } from "../Helpers/sendRequest";
import {
  Bookmark,
  BookmarkBorder,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import WarningCard from "./WarningCard";
import defaultAvatar from "../Assets/Default_Avatar.png";
import "./PostLike.css";

export default function PostCard(props) {
  const bottomRef = useRef();
  const [comments, setComments] = useState([]);
  const [heartActive, setHeartActive] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [liked, setLiked] = useState(
    props.liked != undefined ? props.liked : props.post.isLiked
  );
  const [likesCount, setLikesCount] = useState(
    props.likesCount != undefined ? props.likesCount : props.post.likesCount
  );
  const [saved, setSaved] = useState(
    props.saved != undefined ? props.saved : props.post.isSaved
  );

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/posts/${props.post._id}/comments`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setComments(res.data);
    } catch (e) {
      console.log(e);
    }
  }, [props]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const deletePost = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/posts/${props.post._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      props.openModalHandler(null);
    } catch (e) {
      console.log(e);
    }
  };
  const handleLikeAnimation = () => {
    setHeartActive(true);
    if (!liked) likePost(setLiked, setLikesCount, "like");
    setTimeout(() => {
      setHeartActive(false);
    }, 1100);
  };

  return (
    <>
      {deleteWarning && (
        <WarningCard
          title="Delete Warning"
          message="Are you sure you want to delete this post?"
          confirmText="Delete"
          onConfirm={deletePost}
          onCancel={() => setDeleteWarning(false)}
          openModalHandler={setDeleteWarning}
        />
      )}
      <div className="left-1/2 top-1/2 h-3/4 mlg:h-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-50 rounded-md overflow-hidden bg-white w-2/3 mlg:w-11/12 flex">
        <div
          onDoubleClick={handleLikeAnimation}
          className="relative cursor-pointer w-1/2 bg-black overflow-y-scroll flex items-center img-wrapper"
        >
          <img className="w-full bg-cover" src={props.post.imageUrl} alt="" />
          <Favorite
            fontSize="large"
            className={`${
              heartActive ? "heart" : ""
            } absolute opacity-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600`}
          />
        </div>
        <div className="w-1/2 text-left flex flex-col justify-between">
          <div className="w-full flex justify-between items-center p-1.5 border-b border-stone-400">
            <div className="flex gap-2 items-center">
              <img
                className="w-8 h-8 rounded-full"
                src={
                  props.post.owner.avatarURL
                    ? props.post.owner.avatarURL
                    : defaultAvatar
                }
              />
              <div className="font-bold mtiny:font-semibold mtiny:text-base">
                {props.post.owner.username}
              </div>
              <div className="text-xs mtiny:text-[10px]">
                <Moment fromNow>{props.post.createdAt}</Moment>
              </div>
            </div>
            {props.post.owner.username == localStorage.getItem("username") && (
              <button onClick={() => setDeleteWarning(true)}>
                <Delete fontSize="small" color="error" />
              </button>
            )}
          </div>
          <div className="h-5/6 overflow-y-scroll img-wrapper">
            {comments.length > 0 &&
              comments.map((comment, idx) => {
                return (
                  <div
                    key={comment._id}
                    className={`${
                      comment.user._id == localStorage.getItem("id") ||
                      comment.user == localStorage.getItem("id")
                        ? "justify-end"
                        : "justify-start"
                    } flex p-1`}
                  >
                    <div
                      key={idx}
                      className="flex gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] border border-stone-300 items-start bg-stone-200 w-3/4 p-1 rounded-md"
                    >
                      <div className="w-10 mtiny:w-6 rounded-full overflow-hidden flex justify-center items-center">
                        <img
                          className="w-full"
                          src={comment.user.avatarURL}
                          alt=""
                        />
                      </div>
                      <div className="w-4/5">
                        <div className="flex justify-between">
                          <div className="font-bold mtiny:font-semibold mtiny:text-sm">
                            {comment.user.name}
                          </div>
                          <div className="text-xs mtiny:text-[8px] text-right">
                            <Moment fromNow>{comment.createdAt}</Moment>
                          </div>
                        </div>
                        <div className="text-sm mtiny:text-xs">
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            <div ref={bottomRef} />
          </div>
          <div className="flex justify-start gap-2 px-1 py-1.5">
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
          <CommentSection
            class="w-full p-1 flex items-center border-t border-stone-400"
            comment={true}
            post={props.post}
            addCommentHandler={setComments}
          />
        </div>
      </div>
    </>
  );
}


PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  openModalHandler: PropTypes.func.isRequired,
  liked: PropTypes.bool,
  likesCount: PropTypes.number,
  saved: PropTypes.bool,
};