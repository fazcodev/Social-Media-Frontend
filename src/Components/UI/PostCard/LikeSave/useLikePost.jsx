import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../../config.js";

const useLikePost = (post) => {
  const [liked, setLiked] = useState(null);
  const [likesCount, setLikesCount] = useState(null);

  useEffect(()=>{
    setLiked(post?.isLiked)
    setLikesCount(post?.likesCount)
  }, [post])
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

  return { liked, likesCount, likePost };
};

export default useLikePost;

