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
      setLikesCount((prevcnt) => {
        if(!((liked && reqType == 'like')||(!liked && reqType == 'unlike'))){
          return reqType == 'like' ? prevcnt + 1 : prevcnt - 1;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (vars, ...args) => likePost(vars.postId, vars.reqType),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(
        {
          predicate: (query) =>query.queryKey[0] === "profile" && query.queryKey[1] === "posts" && (query.queryKey[2].type === "saved" || query.queryKey[2].type === "posted"),
          refetchType: 'none'
        },
        { throwonError: true }
      );
      queryClient.invalidateQueries(
        {
          queryKey: ['post', post._id, { type: 'info' }],
          refetchType: 'none',
          exact: true
        },
        { throwonError: true }
      )
      queryClient.setQueryData(
        ['feed'],
        (prevPages) =>
          prevPages.map((page) =>
            page.map((p) => {
              if (p._id === post._id) {
                return { isLiked: liked, likesCount, ...p };
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
