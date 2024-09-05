import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import { fetchComments } from "../../../../Utils/FetchUtils";
import { captionActions } from "../../../../Store/ImageEditor";
import { apiUrl } from "../../../../Config/config";
import EmojiPicker from "./EmojiPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CommentSection({ comment, cls, postId }) {
  const dispatch = useDispatch();
  const { caption } = useSelector((state) => state.caption);
  const [myComment, setMyComment] = useState("");
  const queryClient = useQueryClient();
  const onTextChange = (e) => {
    if (comment != undefined) {
      setMyComment(e.currentTarget.value);
      return;
    }
    if (comment == undefined && e.target.value.length <= 2200) {
      dispatch(captionActions.setCaption(e.currentTarget.value));
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/posts/${postId}/comment`,
        { text: myComment },
        { withCredentials: true }
      );
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };
  const mutation = useMutation({
    mutationFn: commentHandler,
    onMutate: async () => {
      const optimisticComment = {
        _id: uuid(),
        text: myComment,
        user: {
          name: localStorage.getItem("name"),
          username: localStorage.getItem("username"),
          avatarURL: localStorage.getItem("avatarURL")
            ? localStorage.getItem("avatarURL")
            : null,
          _id: localStorage.getItem("id"),
        },
        createdAt: "temp",
      };
      const { pages: prevCommentPages, pageParams } =
        await queryClient.getQueryData(["post", postId, { type: "comments" }]);
      // console.log(pageParams);
      await queryClient.setQueryData(
        ["post", postId, { type: "comments" }],
        ({ pages: [firstPage, ...restPages], pageParams }) => {
          return {
            pages: [[optimisticComment, ...firstPage], ...restPages],
            pageParams,
          };
        }
      );

      return { prevCommentPages };
    },
    onError: (err, variables, context) => {
      console.log(err);
      queryClient.setQueryData(
        ["post", postId, { type: "comments" }],
        context.prevCommentPages
      );
    },
    onSettled: (data, variables, context) => {
      setMyComment("");
      // setCount((prev) => prev + 1);
      queryClient.setQueryData(
        ["post", postId, { type: "comments" }],
        ({ pages: [firstPage, ...restPages], pageParams }) => {
          return {
            pages: [
              [data, ...firstPage.slice(1, firstPage.length)],
              ...restPages,
            ],
            pageParams,
          };
        }
      );
    },
  });
  const prefetchComments = async () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["post", postId, { type: "comments" }],
      queryFn: async (...args) => {
        const data = await fetchComments(postId, ...args);
        return data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage?.length < 10) return null;
        return pages?.length;
      },
    });
  };
  return (
    <div className={`${cls ? cls : ""}`}>
      <textarea
        onFocus={comment ? prefetchComments : null}
        rows={comment == undefined ? 5: 2}
        value={comment != undefined ? myComment : caption}
        onChange={onTextChange}
        className="img-wrapper mtiny:h-8 w-full outline-none resize-none"
        placeholder={`${
          comment == undefined ? "Add a caption" : "Add a comment"
        }`}
      />

      <div className="flex h-fit relative justify-between">
        <EmojiPicker comment={comment} setMyComment={setMyComment} />
        <div
          className={`${
            caption.length || myComment.length ? "opacity-100" : "opacity-50"
          }`}
        >
          {comment == undefined && (
            <span className="opacity-50">{caption.length}/2,200</span>
          )}
          {comment != undefined && myComment.length > 0 && (
            <button
              disabled={
                (caption.length == 0 && myComment.length == 0) ||
                mutation.isPending
              }
              className="text-blue-500 font-semibold text-lg ml-3 disabled:opacity-30 hover:text-blue-600"
              onClick={mutation.mutate}
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

CommentSection.propTypes = {
  comment: PropTypes.bool,
  cls: PropTypes.string,
  setCount: PropTypes.func,
  postId: PropTypes.string,
};
