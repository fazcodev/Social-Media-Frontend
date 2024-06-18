import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { captionActions } from "../../../../Store/ImageEditor";

const EmojiPicker = ({ comment, setMyComment }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const dispatch = useDispatch();
  const { caption } = useSelector((state) => state.caption);

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    if (!comment && (caption + emoji).length <= 2200) {
      dispatch(captionActions.setCaption(caption + emoji));
      return;
    }
    setMyComment((prev) => prev + emoji);
  };
  
  return (
    <div>
      <button
        className="bg-transparent"
        onClick={() => setShowEmojis((prev)=>!prev)}
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
            comment == undefined ? "-bottom-30 h-48" : "h-48 -top-48 right-5"
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
  );
};

export default EmojiPicker;

EmojiPicker.propTypes = {
  comment: PropTypes.string,
  setMyComment: PropTypes.func,
};
