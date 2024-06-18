import axios from "axios";

const likePost = async (setLiked, setLikesCount, postId, reqType) => {
    try {
      await axios({
        method: 'post',
        url: `${apiUrl}/posts/${postId}/${reqType}`,
        withCredentials : true

      })
      setLiked(reqType == 'like');
      setLikesCount((prevcnt) => prevcnt +(reqType == 'like' ? 1 : -1));
    } catch (error) {
      console.log(error);
    }
  };

  const savePost = async (setSaved, postId, reqType) => {
    try {
      await axios({
        method: reqType == 'save' ? 'post' : 'delete',
        url: `${apiUrl}/posts/${postId}/${reqType}`,
        withCredentials : true
      })
      setSaved(reqType == 'save');
    } catch (error) {
      console.log(error);
    }
  };

export { likePost, savePost};
