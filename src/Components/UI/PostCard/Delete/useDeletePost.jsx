import axios from "axios";
import { apiUrl } from "../../../../config.js";

const useDeletePost = (modalHandler) => {
  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `${apiUrl}/posts/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (modalHandler) modalHandler(null);
    } catch (e) {
      console.log(e);
    }
  };

  return { deletePost };
};

export default useDeletePost;
