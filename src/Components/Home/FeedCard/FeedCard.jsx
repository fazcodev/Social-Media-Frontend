import { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import defaultAvatar from "../../Assets/Default_Avatar.png";
import CardComments from "./CardComments";
import LikeSaveCard from "./LikeSaveCard";

const FeedCard = forwardRef(function FeedCard(props, ref){

  const [readMore, setReadMore] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div
        ref={ref}
        className="w-1/2 mmd:w-2/3 mtiny:w-4/5 mx-auto text-left my-5 border-b border-stone-300"
      >
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden object-center">
            <img
              className="bg-cover aspect-square"
              src={
                props.post.owner.avatarURL
                  ? props.post.owner.avatarURL
                  : defaultAvatar
              }
              alt="avatar"
            />
          </div>
          <div
            onClick={() =>
              navigate(`/profile/users/${props.post.owner.username}`)
            }
            className="ml-2 font-bold hover:underline cursor-pointer"
          >
            {props.post.owner.username}
          </div>
        </div>
        <div>
          <img
            className="w-full bg-cover"
            src={props.post.imageUrl}
            alt="post"
          />
        </div>
        <LikeSaveCard post={props.post}/>

        <div className="">
          {!readMore && <span>{props.post.description.substring(0, 50)}</span>}
          {readMore && <span>{`${props.post.description} `}</span>}
          {readMore && (
            <button
              onClick={() => setReadMore(false)}
              className="text-blue-500 hover:underline"
            >
              view less
            </button>
          )}
          {props.post.description.length > 50 && !readMore && (
            <button
              onClick={() => setReadMore(true)}
              className="text-blue-500 hover:underline"
            >
              ...read more
            </button>
          )}
        </div>
        <CardComments post = {props.post}/>
      </div>
    </>
  );
});


export default FeedCard;

FeedCard.propTypes = {
  post: PropTypes.object.isRequired,
  ref: PropTypes.object,
};
