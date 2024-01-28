import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useDispatch, useSelector } from "react-redux";
import { captionActions } from "../../Store/ImageEditor";
import axios from "axios";
import { BASE_URL } from "../Helpers/sendRequest";

export default function CommentSection(props) {
  const [showEmojis, setShowEmojis] = useState(false);
  const dispatch = useDispatch();
  const { caption } = useSelector((state) => state.caption);
  const [myComment, setMyComment] = useState("");
  const onTextChange = (e) => {
    if (props.comment != undefined) {
      setMyComment(e.currentTarget.value);
      return;
    }
    if (props.comment == undefined && e.target.value.length <= 2200) {
      dispatch(captionActions.setCaption(e.currentTarget.value));
    }
  };
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    if (props.comment == undefined && (caption + emoji).length <= 2200) {
      dispatch(captionActions.setCaption(caption + emoji));
      return;
    }
    setMyComment((prev) => prev + emoji);
  };
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/posts/${props.post._id}/comment`,
        {
          text: myComment,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setMyComment("");
      if (props.setCount != undefined) props.setCount((prev) => prev + 1);
      props.addCommentHandler((prev) => [...prev, res.data]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={`${props.class ? props.class : ""}`}>
      <textarea
        // style={{ height: "80%" }}

        rows={props.comment == undefined ? 5 : 2}
        value={props.comment != undefined ? myComment : caption}
        onChange={onTextChange}
        className="img-wrapper w-full outline-none resize-none"
        placeholder={`${
          props.comment == undefined ? "Add a caption" : "Add a comment"
        }`}
      />
      <div className="flex h-fit relative justify-between">
        <div>
          <button
            className="bg-transparent"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <svg
              className="h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              opacity="30%"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          {showEmojis && (
            <div
              className={`${
                props.comment == undefined
                  ? "-bottom-30 h-48"
                  : "h-48 -top-48 right-5"
              } rounded-md absolute text-left overflow-hidden`}
            >
              <Picker
                emojiSize={15}
                emojiButtonSize={24}
                data={data}
                onEmojiSelect={addEmoji}
              />
            </div>
          )}
        </div>
        <div
          className={`${
            caption.length || myComment.length ? "opacity-100" : "opacity-50"
          }`}
        >
          {props.comment == undefined && (
            <span className="opacity-50">{caption.length}/2,200</span>
          )}
          {props.comment != undefined && myComment.length > 0 && (
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
