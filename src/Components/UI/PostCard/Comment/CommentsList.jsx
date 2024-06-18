import { useRef, useEffect} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Moment from "react-moment";

import {apiUrl} from '../../../../config'
import defaultAvatar from "../../../Assets/Default_Avatar.png";

const CommentsList = ({ comments, setComments, postId }) => {
  const bottomRef = useRef();

  

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${apiUrl}/posts/${postId}/comments`, {
          withCredentials : true
        });
        setComments(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchComments(postId)
  }, [postId, setComments]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);
  return (
    <div className="h-5/6 overflow-y-scroll img-wrapper">
      {comments.length > 0 &&
        comments.map((comment, idx) => {
          return (
            <div
              key={comment._id}
              className={`${
                comment.user._id == localStorage.getItem("id") ||
                comment.user == localStorage.getItem("id")
                  ? "justify-end"
                  : "justify-start"
              } flex p-1`}
            >
              <div
                key={idx}
                className="flex gap-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] border border-stone-300 items-start bg-stone-200 w-3/4 p-1 rounded-md"
              >
                <div className="w-10 mtiny:w-6 rounded-full overflow-hidden flex justify-center items-center">
                  <img className="w-full" src={comment?.user?.avatarUrl ? comment.user.avatarUrl : defaultAvatar} alt="" />
                </div>
                <div className="w-4/5">
                  <div className="flex justify-between">
                    <div className="font-bold mtiny:font-semibold mtiny:text-sm">
                      {comment.user.name}
                    </div>
                    <div className="text-xs mtiny:text-[8px] text-right">
                      <Moment fromNow>{comment.createdAt}</Moment>
                    </div>
                  </div>
                  <div className="text-sm mtiny:text-xs">{comment.text}</div>
                </div>
              </div>
            </div>
          );
        })}
      <div ref={bottomRef} />
    </div>
  );
};

export default CommentsList;

CommentsList.propTypes = {
  postId: PropTypes.isRequired,
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
};
