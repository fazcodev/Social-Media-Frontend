import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import PropTypes from "prop-types";
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
  // const statePosts = useSelector((state) => state.auth.posts);
  // const stateBio = useSelector((state) => state.auth.bio);

  // const avatarURL = user ? user.avatarURL : localStorage.getItem("avatarURL");
  // const username = localStorage.getItem("username");
  // const name = user?.username || localStorage.getItem("name");
  // const bio = user?.bio || stateBio;
  // const userPosts = posts || statePosts;

  const mutation = useMutation({
    mutationFn: async (action) => {
      await axios({
        method: action === "follow" ? "post" : "delete",
        url: `${apiUrl}/users/${username}/${action}`,
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query)=>{
          return query.queryKey[0] === "profile" && query.queryKey[1] === desc && (query.queryKey.at(-1) === currUser || query.queryKey.at(-1) == username)
        }
      });
    },
  });
  // useEffect(() => {
  //   const fetchFollowers = async () => {
  //     try {
  //       const res = await axios.get(`${apiUrl}/users/${username}/followers`);
  //       setFollowers(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   const fetchFollowings = async () => {
  //     try {
  //       const res = await axios.get(`${apiUrl}/users/${username}/followings`);
  //       setFollowings(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchFollowers();
  //   fetchFollowings();
  // }, [username]);

  const userInfo = useQueries({
    queries: [
      {
        queryKey: ["profile", 'desc', {type: 'followers'}, username],
        queryFn: () => fetchFollowers(username),
        staleTime: 5000 * 60,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["profile", 'desc', {type: 'followings'}, username],
        queryFn: () => fetchFollowings(username),
        staleTime: 5000 * 60,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["profile", 'desc', {type: 'info'}, username],
        queryFn: () => fetchUserInfo(username),
        staleTime: 5000 * 60,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const toggleFollowUser = async () => {
    const action = userInfo[0].data.some(
      (u) => u.follower === localStorage.getItem("id")
    )
      ? "unfollow"
      : "follow";

    mutation.mutate(action);

    // try {
    //   await axios({
    //     method: action === "follow" ? "post" : "delete",
    //     url: `${apiUrl}/users/${username}/${action}`,
    //     withCredentials: true,
    //   });
    //   setFollowers((prev) =>
    //     action === "follow"
    //       ? [...prev, { follower: localStorage.getItem("id") }]
    //       : prev.filter((u) => u.follower !== localStorage.getItem("id"))
    //   );
    // } catch (err) {
    //   console.error(err);
    // }
    // setLoading(false);
  };

  return (
    <>
      {editAvatarModal && (
        <Modal title="Edit Avatar" openModalHandler={setEditAvatarModal} />
      )}
      <div className="p-3 msm:px-2">
        <div className="flex justify-center items-center gap-10 mlg:gap-8 mmd:gap-5">
          <div
            onClick={username === currUser ? () => setEditAvatarModal(true) : null}
            className={`relative aspect-square inline-block rounded-full shrink w-[25%] items-center img-overlay ${
              username === currUser
                ? "cursor-pointer"
                : ""
            }`}
          >
            {username === currUser && (
              <>
                <div className="overlay w-full rounded-full" />
                <div className="middle text-xs text-center text-gray-300">
                  <CameraAlt fontSize="small" />
                  <p>Change Profile Photo</p>
                </div>
              </>
            )}
            <img
              className="rounded-full w-full object-cover"
              alt="User Avatar"
              src={
                (userInfo[2].data?.avatarURL)
                  ? userInfo[2].data.avatarURL
                  : AvatarPNG
              }
            />
          </div>
          <div className="flex-col flex gap-3">
            <div className="flex gap-5 mtiny:flex-col mtiny:gap-2">
              <h1 className="text-2xl mtiny:text-xl font-bold">{username}</h1>
              <div>
                {username === currUser ? (
                  <button
                    onClick={() => navigate("/Profile/edit")}
                    className="bg-stone-100 hover:bg-stone-200 rounded-md px-2 py-0.5 text-sm font-bold transition-all"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={toggleFollowUser}
                    disabled={mutation.isPending || userInfo[0]?.isFetching}
                    className={`disabled:opacity-50 bg-blue-500 hover:bg-blue-600 rounded-lg px-3 text-white text-sm font-bold transition-all`}
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
            <div className="flex gap-3 text-center shrink mtiny:gap-1">
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${userInfo[2]?.data?.postsCnt ? userInfo[2].data.postsCnt : 0} Posts`}</h1>
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${
                userInfo[0]?.data?.length ? userInfo[0].data.length : 0
              } Followers`}</h1>
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${
                userInfo[1]?.data?.length ? userInfo[1].data.length : 0
              } Following`}</h1>
            </div>
            <div className="text-left">
              <h1 className="text-lg mtiny:text-base mtiny:font-semibold font-bold">
                {userInfo[2]?.data?.name}
              </h1>
              <h1 className="text-base mtiny:text-sm font-medium">
                {userInfo[2]?.data?.bio}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default ProfileDesc;
