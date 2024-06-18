import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Modal from "../UI/Modal";
import { CameraAlt } from "@mui/icons-material";
import AvatarPNG from '../Assets/Default_Avatar.png';
import { apiUrl } from "../../config";

const ProfileDesc = ({ user, posts }) => {
  const [editAvatarModal, setEditAvatarModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { username: paramsUsername } = useParams();
  const statePosts = useSelector((state) => state.auth.posts);
  const stateBio = useSelector((state) => state.auth.bio);

  const avatarURL = user ? user.avatarURL : localStorage.getItem("avatarURL");
  const username = paramsUsername || localStorage.getItem("username");
  const name = user?.username || localStorage.getItem("name");
  const bio = user?.bio || stateBio;
  const userPosts = posts || statePosts;

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`${apiUrl}/users/${username}/followers`);
        setFollowers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFollowings = async () => {
      try {
        const res = await axios.get(`${apiUrl}/users/${username}/followings`);
        setFollowings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFollowers();
    fetchFollowings();
  }, [username]);

  const toggleFollowUser = async () => {
    setLoading(true);
    const action = followers.some((u) => u.follower === localStorage.getItem("id")) ? "unfollow" : "follow";
    try {
      await axios({
        method: action === "follow" ? "post" : "delete",
        url: `${apiUrl}/users/${username}/${action}`,
        withCredentials: true,
      });
      setFollowers((prev) =>
        action === "follow"
          ? [...prev, { follower: localStorage.getItem("id") }]
          : prev.filter((u) => u.follower !== localStorage.getItem("id"))
      );
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      {editAvatarModal && <Modal title="Edit Avatar" openModalHandler={setEditAvatarModal} />}
      <div className="p-3 msm:px-2">
        <div className="flex justify-center gap-10 msm:gap-5">
          <div
            onClick={!user ? () => setEditAvatarModal(true) : null}
            className="relative basis-5/12 xl:basis-[20%] mlg:basis-3/5 mtiny:basis-3/4 shrink flex items-center img-overlay overflow-hidden cursor-pointer"
          >
            {!user&& (
              <>
                <div className="overlay rounded-full" />
                <div className="middle text-xs text-center text-gray-300">
                  <CameraAlt fontSize="small" />
                  <p>Change Profile Photo</p>
                </div>
              </>
            )}
            <img
              className="w-full rounded-full"
              alt="User Avatar"
              src={avatarURL ? avatarURL : AvatarPNG}
            />
          </div>
          <div className="flex-col flex gap-3">
            <div className="flex gap-5 mtiny:flex-col mtiny:gap-2">
              <h1 className="text-2xl mtiny:text-xl font-bold">{username}</h1>
              <div>
                {!user ? (
                  <button
                    onClick={() => navigate("/Profile/edit")}
                    className="bg-stone-100 hover:bg-stone-200 rounded-md px-2 py-0.5 text-sm font-bold transition-all"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={toggleFollowUser}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 rounded-lg px-3 text-white text-sm font-bold transition-all"
                  >
                    {followers.some((u) => u.follower === localStorage.getItem("id")) ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-3 text-center shrink mtiny:gap-1">
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${userPosts.length} Posts`}</h1>
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${followers.length} Followers`}</h1>
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${followings.length} Following`}</h1>
            </div>
            <div className="text-left">
              <h1 className="text-lg mtiny:text-base mtiny:font-semibold font-bold">{name}</h1>
              <h1 className="text-base mtiny:text-sm font-medium">{bio}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ProfileDesc.propTypes = {
  user: PropTypes.object,
  posts: PropTypes.array,
};

export default ProfileDesc;
