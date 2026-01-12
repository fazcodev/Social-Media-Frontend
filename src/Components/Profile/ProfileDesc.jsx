import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useMutation,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { PersonOffOutlined } from "@mui/icons-material";
import axios from "axios";
import Modal from "../UI/Modal";
import { CameraAlt } from "@mui/icons-material";
import AvatarPNG from "../Assets/Default_Avatar.png";
import { apiUrl } from "../../Config/config";
import {
  fetchFollowers,
  fetchFollowings,
  fetchUserInfo,
} from "../../Utils/FetchUtils";
import "../UI/ImageOverlay.css";

const ProfileDesc = () => {
  const [editAvatarModal, setEditAvatarModal] = useState(false);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const username = (useParams()?.username) ? useParams().username : localStorage.getItem("username");
  const currUser = localStorage.getItem('username')

  const mutation = useMutation({
    mutationFn: async (action) => {
      const encodedUsername = encodeURIComponent(username);
      await axios({
        method: action === "follow" ? "post" : "delete",
        url: `${apiUrl}/users/${encodedUsername}/${action}`,
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "profile" && query.queryKey[1] === "desc" && (query.queryKey.at(-1) === currUser || query.queryKey.at(-1) === username)
        }
      });
      queryClient.invalidateQueries({ queryKey: ["profile", "suggestions"] });
    },
  });

  const userInfo = useQueries({
    queries: [
      {
        queryKey: ["profile", 'desc', { type: 'followers' }, username],
        queryFn: () => fetchFollowers(username),
        staleTime: 5000 * 60,
        refetchOnWindowFocus: false,
        retry: false,
      },
      {
        queryKey: ["profile", 'desc', { type: 'followings' }, username],
        queryFn: () => fetchFollowings(username),
        staleTime: 5000 * 60,
        refetchOnWindowFocus: false,
        retry: false,
      },
      {
        queryKey: ["profile", 'desc', { type: 'info' }, username],
        queryFn: () => fetchUserInfo(username),
        staleTime: 5000 * 60,
        refetchOnWindowFocus: false,
        retry: false,
      },
    ],
  });

  // Check if user doesn't exist (API returned 404)
  const userNotFound = userInfo[2].isError;
  const isLoading = userInfo[2].isLoading;

  const toggleFollowUser = async () => {
    const action = userInfo[0].data.some(
      (u) => u.follower === localStorage.getItem("id")
    )
      ? "unfollow"
      : "follow";

    mutation.mutate(action);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center gap-10 max-w-4xl mx-auto animate-pulse">
          <div className="w-[25%] aspect-square rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="flex-col flex gap-4 flex-1">
            <div className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="flex gap-6">
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (userNotFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-lg rounded-2xl p-10 text-center max-w-md">
          <PersonOffOutlined sx={{ fontSize: 64 }} className="text-slate-400 dark:text-slate-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            User Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            The user <span className="font-semibold text-slate-700 dark:text-slate-300">@{username}</span> doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {editAvatarModal && (
        <Modal title="Edit Avatar" openModalHandler={setEditAvatarModal} />
      )}
      <div className="p-6 msm:px-4">
        <div className="flex justify-center items-center gap-10 mlg:gap-8 mmd:gap-5 max-w-4xl mx-auto">
          <div
            onClick={username === currUser ? () => setEditAvatarModal(true) : null}
            className={`relative aspect-square inline-block rounded-full shrink w-[25%] items-center img-overlay ${username === currUser
              ? "cursor-pointer group"
              : ""
              }`}
          >
            {username === currUser && (
              <>
                <div className="overlay w-full rounded-full bg-black/40 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="middle text-xs text-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <CameraAlt fontSize="small" />
                  <p>Change</p>
                </div>
              </>
            )}
            <img
              className="rounded-full w-full h-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
              alt="User Avatar"
              src={
                (userInfo[2].data?.avatarURL)
                  ? userInfo[2].data.avatarURL
                  : AvatarPNG
              }
            />
          </div>
          <div className="flex-col flex gap-4">
            <div className="flex gap-6 mtiny:flex-col mtiny:gap-3 items-center">
              <h1 className="text-2xl mtiny:text-xl font-bold text-slate-900 dark:text-white tracking-tight">{username}</h1>
              <div>
                {username === currUser ? (
                  <button
                    onClick={() => navigate("/Profile/edit")}
                    className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg px-4 py-1.5 text-sm font-bold transition-all shadow-sm"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={toggleFollowUser}
                    disabled={mutation.isPending || userInfo[0]?.isFetching}
                    className={`disabled:opacity-50 bg-accent hover:bg-accent-dark rounded-lg px-6 py-1.5 text-white text-sm font-bold transition-all shadow-md shadow-accent/20`}
                  >
                    {userInfo[0]?.data?.some(
                      (u) => u.follower === localStorage.getItem("id")
                    )
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-6 text-center shrink mtiny:gap-3 text-slate-700 dark:text-slate-300">
              <h1 className="text-base font-semibold"><span className="font-bold text-slate-900 dark:text-white mr-1">{`${userInfo[2]?.data?.postsCnt ? userInfo[2].data.postsCnt : 0}`}</span>Posts</h1>
              <h1 className="text-base font-semibold"><span className="font-bold text-slate-900 dark:text-white mr-1">{`${userInfo[0]?.data?.length ? userInfo[0].data.length : 0
                }`}</span>Followers</h1>
              <h1 className="text-base font-semibold"><span className="font-bold text-slate-900 dark:text-white mr-1">{`${userInfo[1]?.data?.length ? userInfo[1].data.length : 0
                }`}</span>Following</h1>
            </div>
            <div className="text-left space-y-1">
              <h1 className="text-lg mtiny:text-base font-bold text-slate-900 dark:text-white">
                {userInfo[2]?.data?.name}
              </h1>
              <p className="text-base mtiny:text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed max-w-lg">
                {userInfo[2]?.data?.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default ProfileDesc;
