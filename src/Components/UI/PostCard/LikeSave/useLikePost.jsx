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
  const likePost = async (postId, reqType) => {
    try {
      await axios({
        method: "post",
        url: `${apiUrl}/posts/${postId}/${reqType}`,
        withCredentials: true,
      });
      setLiked(reqType == "like");
      setLikesCount((prevcnt) => prevcnt + (reqType == "like" ? 1 : -1));
    } catch (error) {
      console.log(error);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (vars, ...args) => likePost(vars.postId, vars.reqType),
    onSuccess: (data, variables, context) => {
      setLiked(reqType == "like");
      setLikesCount((prevcnt) => prevcnt + (reqType == "like" ? 1 : -1));
      queryClient.invalidateQueries(
        {
          queryKey: [
            "profile",
            "posts",
            { type: "saved" },
            localStorage.getItem("username"),
          ],
          exact: true,
          refetchType: "all",
        },
        { throwonError: true }
      );
      queryClient.setQueryData(
        [
          "profile",
          "posts",
          { type: "posted" },
          localStorage.getItem("username"),
        ],
        (prevPages) =>
          prevPages.map((page) =>
            page.map((p) => {
              if (p._id === post._id) {
                return { isLiked: liked, ...p };
              }
              return p;
            })
          )
      );
      queryClient.setQueryData(
        ['feed'],
        (prevPages) =>
          prevPages.map((page) =>
            page.map((p) => {
              if (p._id === post._id) {
                return { isLiked: liked, ...p };
              }
              return p;
            })
          )
      );
    },
  });

  return { liked, likesCount, likePost: mutate, isPending };
};

export default useLikePost;
