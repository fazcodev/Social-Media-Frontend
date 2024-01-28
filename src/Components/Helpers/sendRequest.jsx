import axios from "axios";
// const BASE_URL = "http://localhost:3000/api";
const BASE_URL = "https://social-media-rest-4xjz.onrender.com/api"

const likePost = async (setLiked, setLikesCount, postId, reqType) => {
    try {
      await axios({
        method: 'post',
        url: `${BASE_URL}/posts/${postId}/${reqType}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },

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
        url: `${BASE_URL}/posts/${postId}/${reqType}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      setSaved(reqType == 'save');
    } catch (error) {
      console.log(error);
    }
  };

export { likePost, savePost, BASE_URL};
