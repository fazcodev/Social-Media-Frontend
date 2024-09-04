import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AvatarPNG from "../Assets/Default_Avatar.png";
import { apiUrl } from "../../Config/config";

const UserCard = ({ user, followings, loading }) => {
  const [isFollowing, setIsFollowing] = useState(
    followings.some((u) => u.following === user._id)
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (req) => {
      await axios({
        method: req == "follow" ? "post" : "delete",
        url: `${apiUrl}/users/${user.username}/${req}`,
        withCredentials: true,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(
        {
          predicate: (query) => {
            return (
              query.queryKey[0] === "profile" &&
              query.queryKey[1] === "desc" &&
              (query.queryKey.at(-1) === user.username ||
                query.queryKey.at(-1) === localStorage.getItem("username"))
            );
          },
        },
        { throwOnError: true }
      );
      setIsFollowing((prev) => !prev);
    },
  });
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
        ) : isFollowing ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              mutation.mutate("unfollow");
            }}
            disabled={mutation.isPending || loading}
            className={`text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-md px-2 py-0.5 text-xs font-semibold`}
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              mutation.mutate("follow");
            }}
            disabled={mutation.isPending || loading}
            className={`text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-md px-2 py-0.5 text-xs font-semibold`}
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
  loading: PropTypes.bool.isRequired,
};
