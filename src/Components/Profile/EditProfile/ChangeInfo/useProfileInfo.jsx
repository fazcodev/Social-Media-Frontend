// useProfileInfo.js
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../../../Config/config";

const useProfileInfo = () => {
  const queryClient = useQueryClient();
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
    const currentUsername = localStorage.getItem("username");

    // Skip check if username is empty or is the user's own current username
    if (
      !userData.username ||
      userData.username.trim() === "" ||
      userData.username.toLowerCase() === currentUsername?.toLowerCase()
    ) {
      setUsernameAvl(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    let cancel;

    const encodedUsername = encodeURIComponent(userData.username);
    axios({
      method: "head",
      url: `${apiUrl}/users/${encodedUsername}`,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(() => {
        setUsernameAvl(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setUsernameAvl(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    return () => cancel();
  }, [userData.username]);

  const handleInputChange = (e) => {
    if (alertMsg) setAlertMsg(null);
    let { name, value } = e.target;
    if (name === "username") {
      value = value.replace(/[^a-zA-Z0-9_.@-]/g, '');
    }
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

    // Build the payload — only include non-empty fields
    const payload = {};
    if (userData.username) payload.username = userData.username;
    if (userData.name) payload.name = userData.name;
    if (userData.age) payload.age = userData.age;
    if (userData.bio) payload.bio = userData.bio;
    if (userData.email) payload.email = userData.email;

    // Don't send an empty update
    if (Object.keys(payload).length === 0) {
      setError(true);
      setAlertMsg("No changes to save");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/users/me`,
        payload,
        { withCredentials: true }
      );

      // Only update frontend state AFTER the API confirms success
      const updatedUser = response.data;
      const oldUsername = localStorage.getItem("username");

      // Update localStorage with server-confirmed values
      if (updatedUser.username) localStorage.setItem("username", updatedUser.username);
      if (updatedUser.name) localStorage.setItem("name", updatedUser.name);
      if (updatedUser.email) localStorage.setItem("email", updatedUser.email);
      if (updatedUser.age !== undefined) localStorage.setItem("age", updatedUser.age);
      if (updatedUser.bio !== undefined) localStorage.setItem("bio", updatedUser.bio || "");

      // Update Redux store with server-confirmed values
      dispatch(
        authActions.setAuthData({
          name: updatedUser.name,
          email: updatedUser.email,
          username: updatedUser.username,
          avatarURL: updatedUser.avatarURL || localStorage.getItem("avatarURL"),
          id: updatedUser._id || localStorage.getItem("id"),
          bio: updatedUser.bio || null,
          age: updatedUser.age || null,
        })
      );

      // Invalidate profile query cache so it re-fetches fresh data
      // Remove old username cache if username changed
      if (payload.username && payload.username !== oldUsername) {
        queryClient.removeQueries({
          queryKey: ["profile", "desc"],
          predicate: (query) => query.queryKey.at(-1) === oldUsername,
        });
      }
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "profile" &&
          query.queryKey[1] === "desc" &&
          (query.queryKey.at(-1) === updatedUser.username || query.queryKey.at(-1) === oldUsername),
      });

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
