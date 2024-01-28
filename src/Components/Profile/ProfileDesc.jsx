import { useEffect, useState,  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import Modal from "../UI/Modal";
import { CameraAlt } from "@mui/icons-material";
import AvatarPNG from "../Assets/Default_Avatar.png";
import { BASE_URL } from "../Helpers/sendRequest";

const ProfileDesc = (props) => {
  const avatarURL =
    props.user != undefined
      ? props.user.avatarURL
      : useSelector((state) => state.auth.avatarURL);
  const [editAvatarModal, setEditAvatarModal] = useState(false);
  const username =
    useParams().username != undefined
      ? useParams().username
      : localStorage.getItem("username");
  const name =
    props.user != undefined
      ? props.user.username
      : localStorage.getItem("name");
  const posts =
    props.posts != undefined
      ? props.posts
      : useSelector((state) => state.auth.posts);
  const bio =
    props.user != undefined
      ? props.user.bio
      : useSelector((state) => state.auth.bio);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/${username}/followers`);
      setFollowers(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/${username}/followings`);
      setFollowings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
  }, []);

  const navigate = useNavigate();

  const userHandler = async () => {
    setLoading(true);
    const req = followers.find((u) => u.follower == localStorage.getItem("id"))
      ? "unfollow"
      : "follow";
    await axios({
      method: req == "follow" ? "post" : "delete",
      url: `${BASE_URL}/users/${username}/${req}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(() => {
        fetchFollowers();
        fetchFollowing();
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <>
      {editAvatarModal && (
        <Modal title="Edit Avatar" openModalHandler={setEditAvatarModal} />
      )}
      <div className="p-3 msm:px-2">
        <div className="flex justify-center gap-10 msm:gap-5">
          <div
            onClick={
              props.user == undefined ? () => setEditAvatarModal(true) : null
            }
            className="relative basis-5/12 xl:basis-[20%] mlg:basis-3/5 mtiny:basis-3/4 shrink flex items-center img-overlay overflow-hidden cursor-pointer"
          >
            {props.user == undefined && <div className="overlay" /> && (
              <div className="middle text-xs text-center text-white">
                <CameraAlt fontSize="small" />
                <p>Change Profile Photo</p>
              </div>
            )}
            <img
              className="w-full rounded-full"
              alt="User Avatar"
              src={avatarURL == undefined ? AvatarPNG : avatarURL}
            />
          </div>

          <div className="flex-col flex gap-3">
            <div className="flex gap-5 mtiny:flex-col mtiny:gap-2">
              <h1 className="text-2xl mtiny:text-xl font-bold">{username}</h1>
              <div className="">
                {props.user == undefined ? (
                  <button
                    onClick={() => navigate("/Profile/edit")}
                    className="bg-stone-100 hover:bg-stone-200 rounded-md px-2 py-0.5 text-sm font-bold transition-all"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={userHandler}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 rounded-lg px-3 text-white text-sm font-bold transition-all"
                  >
                    {followers.find(
                      (u) => u.follower == localStorage.getItem("id")
                    )
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 text-center shrink mtiny:gap-1">
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${posts.length} Posts`}</h1>
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${followers.length} Followers`}</h1>
              <h1 className="text-sm font-bold mtiny:font-semibold">{`${followings.length} Following`}</h1>
            </div>

            <div className=" text-left">
              <h1 className="text-lg mtiny:text-base mtiny:font-semibold font-bold">
                {name}
              </h1>
              <h1 className="text-base mtiny:text-sm font-medium">{bio}</h1>
              {/* <h1 className="text-lg mtiny:text-base mtiny:font-semibold font-bold">Website</h1> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDesc;


ProfileDesc.propTypes = {
  user: PropTypes.object,
  posts: PropTypes.array,
};
