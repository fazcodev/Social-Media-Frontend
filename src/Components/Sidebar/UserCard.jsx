import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import AvatarPNG from "../Assets/Default_Avatar.png";

const UserCard = ({ user, followings, userHandler, disabled, loading }) => {
  const navigate = useNavigate();
  const isCurrentUser = user.username === localStorage.getItem("username");

  return (
    <div
      onClick={() => {
        isCurrentUser
          ? navigate("/profile/posts")
          : navigate(`/profile/users/${user.username}`);
      }}
      key={user._id}
      className="w-full flex items-center cursor-pointer p-2 border-b border-stone-200"
    >
      <img
        src={user.avatarURL || AvatarPNG}
        alt=""
        className="w-10 h-10 mtiny:w-7 mtiny:h-7 rounded-full object-cover"
      />
      <div className="ml-2">
        <h1 className="text-sm font-bold">{user.name}</h1>
        <h1 className="text-xs">@{user.username}</h1>
      </div>
      <div className="ml-auto">
        {isCurrentUser ? (
          <button className="disabled text-stone-600 hover:text-black text-sm font-bold">
            You
          </button>
        ) : followings.find((u) => u.following === user._id) ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              userHandler(user.username, "unfollow");
            }}
            disabled={disabled || loading}
            className="text-white bg-blue-500 rounded-md px-2 py-0.5 hover:bg-blue-600 text-xs font-semibold"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              userHandler(user.username, "follow");
            }}
            disabled={disabled || loading}
            className="text-white bg-blue-500 rounded-md px-2 py-0.5 hover:bg-blue-600 text-xs font-semibold"
          >
            Follow
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
    followings: PropTypes.array.isRequired,
    userHandler: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    };
    
