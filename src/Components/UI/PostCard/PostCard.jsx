import { useEffect, useState} from "react";
import Moment from "react-moment";
import axios from "axios";
import PropTypes from "prop-types";

import CommentSection from "./Comment/CommentSection";
import LikeSavePost from "./LikeSave/LikeSavePost";
import LikePostAnimation from "./LikeSave/LikePostAnimation";

import { apiUrl } from "../../../config";

import defaultAvatar from "../../Assets/Default_Avatar.png";
import "../../Image/ImageContainer.css";
import CommentsList from "./Comment/CommentsList";
import DeletePost from "./Delete/DeletePost";

const PostCard = ({postId, openModalHandler})=>{
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);

  // console.log(post)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${apiUrl}/posts/${postId}`, {
          withCredentials: true,
        });
        setPost(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchPost();
  }, [postId]);

  return (
    <>
      <div className="left-1/2 top-1/2 h-3/4 mlg:h-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-50 rounded-md overflow-hidden bg-white w-2/3 mlg:w-11/12 flex">
        <LikePostAnimation post={post} />
        <div className="w-1/2 text-left flex flex-col justify-between">
          <div className="w-full flex justify-between items-center p-1.5 border-b border-stone-400">
            <div className="flex gap-2 items-center">
              <img
                className="w-8 h-8 rounded-full"
                alt="User Avatar"
                src={
                  post?.owner?.avatarUrl ? post?.owner?.avatarUrl : defaultAvatar
                }
              />
              <div className="font-bold mtiny:font-semibold mtiny:text-base">
                {post?.owner?.username}
              </div>
              <div className="text-xs mtiny:text-[10px]">
                <Moment fromNow>{post?.createdAt}</Moment>
              </div>
            </div>
            <DeletePost post={post} modalHandler={openModalHandler} />
          </div>
          <CommentsList
            postId={postId}
            comments={comments}
            setComments={setComments}
          />
          <LikeSavePost post={post} />
          <CommentSection
            cls="w-full p-1 flex items-center border-t border-stone-400"
            comment={true}
            postId={postId}
            addCommentHandler={setComments}
          />
        </div>
      </div>
    </>
  );
}

export default PostCard

PostCard.propTypes = {
  postId: PropTypes.string.isRequired,
  openModalHandler: PropTypes.func.isRequired,
};
