import { useEffect, useState } from "react";
import Moment from "react-moment";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";

import CommentSection from "./Comment/CommentSection";
import LikeSavePost from "./LikeSave/LikeSavePost";
import LikePostAnimation from "./LikeSave/LikePostAnimation";

import { apiUrl } from "../../../Config/config";

import defaultAvatar from "../../Assets/Default_Avatar.png";
import "../../Image/ImageContainer.css";
import CommentsList from "./Comment/CommentsList";
import DeletePost from "./Delete/DeletePost";
import { fetchPost } from "../../../Utils/FetchUtils";
import useLikePost from "./LikeSave/useLikePost";

const PostCard = ({ postId, postOwner, openModalHandler }) => {
  const queryClient = useQueryClient();
  const [comments, setComments] = useState([]);

  const { data: post } = useQuery({
    queryKey: ["post", postId, { type: "info" }],
    queryFn: async () => await fetchPost(postId),
    initialData: () => {
      let data = queryClient
        .getQueryData([
          "profile",
          "posts",
          { type: "posted" },
          postOwner.username,
        ])
        ?.pages.flat()
        .find((p) => p._id === postId)
      if (data) return data
      return queryClient
        .getQueryData([
          "profile",
          "posts",
          { type: "saved" },
          localStorage.getItem("username"),
        ])
        ?.pages.flat()
        .find((p) => p._id === postId)
    },
    initialDataUpdatedAt: queryClient.getQueryState([
      "profile",
      "posts",
      { type: "posted" },
      postOwner.username,
    ])?.dataUpdatedAt,
    staleTime: 5000 * 60,
    refetchOnWindowFocus: false,
  });

  const { liked, likePost, isPending: pendingLike } = useLikePost(post);
  return (
    <>
      <div className="left-1/2 top-1/2 h-3/4 mlg:h-3/5 -translate-x-1/2 -translate-y-1/2 fixed z-50 rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 border border-white/40 dark:border-slate-600 shadow-[0_0_50px_-10px_rgba(0,0,0,0.3)] backdrop-blur-3xl w-2/3 mlg:w-11/12 flex mtiny:flex-col">
        <LikePostAnimation post={post} liked={liked} likePost={likePost} />
        <div className="w-1/2 mtiny:w-full mtiny:h-1/2 grow text-left flex flex-col justify-between">
          <div className="w-full flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-700/50">
            <div className="flex gap-3 items-center">
              <img
                className="w-8 h-8 rounded-full ring-2 ring-transparent group-hover:ring-accent/50"
                alt="User Avatar"
                src={
                  post?.owner?.avatarURL
                    ? post?.owner?.avatarURL
                    : defaultAvatar
                }
              />
              <div className="flex flex-col">
                <div className="font-bold mtiny:font-semibold mtiny:text-base text-slate-900 dark:text-white leading-tight">
                  {post?.owner?.username}
                </div>
                <div className="text-xs mtiny:text-[10px] text-slate-500 dark:text-slate-400">
                  <Moment fromNow>{post?.createdAt}</Moment>
                </div>
              </div>
            </div>
            {post?.owner?.username === localStorage.getItem("username") && (
              <DeletePost post={post} modalHandler={openModalHandler} />
            )}
          </div>
          <CommentsList
            postId={postId}
            comments={comments}
            setComments={setComments}
          />
          <LikeSavePost
            post={post}
            liked={liked}
            likePost={likePost}
            pendingLike={pendingLike}
          />
          <CommentSection
            cls="w-full mtiny:shrink p-2 flex items-center border-t border-slate-200 dark:border-slate-700/50"
            comment={true}
            postId={postId}
          // addCommentHandler={setComments}
          />
        </div>
      </div>
    </>
  );
};

export default PostCard;

PostCard.propTypes = {
  postId: PropTypes.string.isRequired,
  postOwner: PropTypes.object.isRequired,
  openModalHandler: PropTypes.func.isRequired,
};
