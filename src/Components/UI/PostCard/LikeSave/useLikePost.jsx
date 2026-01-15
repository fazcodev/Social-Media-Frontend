import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../Config/config.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useLikePost = (post) => {
  const [liked, setLiked] = useState(null);
  const [likesCount, setLikesCount] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLiked(post?.isLiked);
    setLikesCount(post?.likesCount);
  }, [post]);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ postId, reqType }) => {
      await axios({
        method: "post",
        url: `${apiUrl}/posts/${postId}/${reqType}`,
        withCredentials: true,
      });
      return { reqType };
    },
    onMutate: async ({ reqType }) => {
      // Store previous values for rollback
      const previousLiked = liked;
      const previousCount = likesCount;

      // Optimistic update
      const newLiked = reqType === "like";
      setLiked(newLiked);
      setLikesCount((prev) => (reqType === "like" ? prev + 1 : prev - 1));

      return { previousLiked, previousCount };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      console.log(err);
      setLiked(context.previousLiked);
      setLikesCount(context.previousCount);
    },
    onSuccess: (data, variables) => {
      const newLiked = variables.reqType === "like";
      const newLikesCount =
        variables.reqType === "like" ? likesCount : likesCount;

      // Invalidate profile queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "profile" &&
          query.queryKey[1] === "posts" &&
          (query.queryKey[2]?.type === "saved" ||
            query.queryKey[2]?.type === "posted"),
        refetchType: "none",
      });

      // Invalidate post info query
      queryClient.invalidateQueries({
        queryKey: ["post", post._id, { type: "info" }],
        refetchType: "none",
        exact: true,
      });

      // Update feed cache with correct infinite query structure
      queryClient.setQueryData(["feed"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((p) => {
              if (p._id === post._id) {
                return {
                  ...p,
                  isLiked: newLiked,
                  likesCount:
                    variables.reqType === "like"
                      ? (post?.likesCount ?? 0) + 1
                      : (post?.likesCount ?? 0) - 1,
                };
              }
              return p;
            })
          ),
        };
      });
    },
  });

  return { liked, likesCount, likePost: mutate, isPending };
};

export default useLikePost;
