import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PropTypes from 'prop-types'



import { captionActions } from "../../../../Store/ImageEditor";
import {apiUrl} from "../../../../config"
import EmojiPicker from "./EmojiPicker"


export default function CommentSection({comment, cls, addCommentHandler, setCount, postId}) {
  const dispatch = useDispatch();
  const { caption } = useSelector((state) => state.caption);
  const [myComment, setMyComment] = useState("");

  const onTextChange = (e) => {
    if (comment != undefined) {
      setMyComment(e.currentTarget.value);
      return;
    }
    if (comment == undefined && e.target.value.length <= 2200) {
      dispatch(captionActions.setCaption(e.currentTarget.value));
    }
  };
  
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/posts/${postId}/comment`,
        {
          text: myComment,
        },
        {
          withCredentials : true,
        }
      );
      setMyComment("");
      if (setCount != undefined) setCount((prev) => prev + 1);
      addCommentHandler((prev) => [...prev, res.data]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={`${cls ? cls : ""}`}>
      <textarea
        // style={{ height: "80%" }}

        rows={comment == undefined ? 5 : 2}
        value={comment != undefined ? myComment : caption}
        onChange={onTextChange}
        className="img-wrapper w-full outline-none resize-none"
        placeholder={`${
          comment == undefined ? "Add a caption" : "Add a comment"
        }`}
      />

      <div className="flex h-fit relative justify-between">
        <EmojiPicker comment = {comment} setMyComment = {setMyComment}/>
        <div
          className={`${
            caption.length || myComment.length ? "opacity-100" : "opacity-50"
          }`}
        >
          {comment == undefined && (
            <span className="opacity-50">{caption.length}/2,200</span>
          )}
          {comment != undefined && myComment.length > 0 && (
            <button
              disabled={!(caption.length || myComment.length)}
              className="text-blue-500 font-semibold text-lg ml-3 disabled:opacity-50"
              onClick={commentHandler}
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


CommentSection.propTypes = {
  comment: PropTypes.bool,
  cls: PropTypes.string,
  addCommentHandler: PropTypes.func,
  setCount: PropTypes.func,
  postId: PropTypes.string
};
