import { useEffect, useState } from "react";
import axios from "axios";
import {apiUrl} from "../../../../config.js";

const useSavePost = (post) => {
  const [saved, setSaved] = useState(null);

  useEffect(()=>{
    setSaved(post?.isSaved)
  }, [post])
  const savePost = async (postId, reqType) => {
    try {
      await axios({
        method: reqType == "save" ? "post" : "delete",
        url: `${apiUrl}/posts/${postId}/${reqType}`,
        withCredentials : true
      });
      setSaved(reqType == "save");
    } catch (error) {
      console.log(error);
    }
  };

  return { saved, savePost };
};

export default useSavePost;


