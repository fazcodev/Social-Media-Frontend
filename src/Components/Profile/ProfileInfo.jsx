import { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import axios from "axios";
import { authActions } from "../../Store/Auth";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../Helpers/sendRequest";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

export default function ProfileInfo() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    name: "",
    age: "",
    bio: "",
  });
  const [error, setError] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameAvl, setUsernameAvl] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    axios({
      method: "head",
      url: `${BASE_URL}/users/${userData.username}`,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(() => {
        setUsernameAvl(false);
      })
      .catch((err) => {
        setUsernameAvl(true);
        console.clear();
      })
      .finally(() => {
        setLoading(false);
      });
    return () => cancel();
  }, [userData.username]);

  const handleInputChange = (e) => {
    if (alertMsg) setAlertMsg(null);
    const { name, value } = e.target;
    if (name === "bio" && value.length > 150) return;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setAlertMsg(null);
    setLoading(true);
    if (userData.username.length > 0 && !usernameAvl) {
      setError(true);
      setAlertMsg("Username not available");
      setLoading(false);
      return;
    }
    dispatch(
      authActions.setAuthData({
        token: localStorage.getItem("token"),
        ...(userData.name
          ? { name: userData.name }
          : { name: localStorage.getItem("name") }),
        ...(userData.email
          ? { email: userData.email }
          : { email: localStorage.getItem("email") }),
        ...(userData.username
          ? { username: userData.username }
          : { username: localStorage.getItem("username") }),
        ...(userData.avatarURL
          ? { avatarURL: userData.avatarURL }
          : { avatarURL: localStorage.getItem("avatarURL") }),
        ...(userData.age ? { age: userData.age } : { age: null }),
        ...(userData.bio ? { bio: userData.bio } : { bio: null }),
      })
    );
    //update all the info in the local storage for name, email, username, avatarURL, age, bio
    if (userData.username) localStorage.setItem("username", userData.username);
    if (userData.name) localStorage.setItem("name", userData.name);
    if (userData.email) localStorage.setItem("email", userData.email);
    if (userData.age) localStorage.setItem("age", userData.age);
    if (userData.bio) localStorage.setItem("bio", userData.bio);
    await axios
      .patch(
        `${BASE_URL}/users/me`,
        {
          ...(userData.username && { username: userData.username }),
          ...(userData.name && { name: userData.name }),
          ...(userData.age && { age: userData.age }),
          ...(userData.bio && { bio: userData.bio }),
          ...(userData.email && { email: userData.email }),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setError(false);
        setAlertMsg("Profile updated successfully");
        setUserData({
          username: "",
          name: "",
          age: "",
          bio: "",
          email: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setAlertMsg(err.response.data.error);
      });
    setLoading(false);
  };
  return (
    <form
      className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Profile Info</h2>
      </div>
      {error && alertMsg && <Alert severity="error">{alertMsg}</Alert>}
      {!error && alertMsg && <Alert severity="success">{alertMsg}</Alert>}
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={userData.username}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Username"
        />
        {!loading && userData.username.length > 0 && (
          <div
            className={`${
              usernameAvl ? "text-green-600" : "text-red-600"
            } inline ml-2`}
          >
            {usernameAvl ? <CheckCircleOutline /> : <CancelOutlined />}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Name"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="age"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={userData.age}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Age"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={2}
          value={userData.bio}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded-md w-1/2 maxh-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Write something about yourself"
        />
        <span className="text-stone-400 ml-2 text-sm">
          {userData.bio.length}/150
        </span>
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Email"
        />
      </div>

      {/* Add input fields for 'name', 'age', 'bio', and 'website' in a similar manner */}

      <button
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
