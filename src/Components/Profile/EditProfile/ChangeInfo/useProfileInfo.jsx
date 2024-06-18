// useProfileInfo.js

import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../../../config";

const useProfileInfo = () => {
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
      url: `${apiUrl}/users/${userData.username}`,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(() => {
        setUsernameAvl(false);
      })
      .catch(() => {
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

  const handleSubmit = async (e, dispatch, authActions) => {
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

    if (userData.username) localStorage.setItem("username", userData.username);
    if (userData.name) localStorage.setItem("name", userData.name);
    if (userData.email) localStorage.setItem("email", userData.email);
    if (userData.age) localStorage.setItem("age", userData.age);
    if (userData.bio) localStorage.setItem("bio", userData.bio);

    try {
      await axios.patch(
        `${apiUrl}/users/me`,
        {
          ...(userData.username && { username: userData.username }),
          ...(userData.name && { name: userData.name }),
          ...(userData.age && { age: userData.age }),
          ...(userData.bio && { bio: userData.bio }),
          ...(userData.email && { email: userData.email }),
        },
        {
          withCredentials: true,
        }
      );
      setError(false);
      setAlertMsg("Profile updated successfully");
      setUserData({
        username: "",
        name: "",
        age: "",
        bio: "",
        email: "",
      });
    } catch (err) {
      setError(true);
      setAlertMsg(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    error,
    alertMsg,
    loading,
    usernameAvl,
    handleInputChange,
    handleSubmit,
  };
};

export default useProfileInfo;
