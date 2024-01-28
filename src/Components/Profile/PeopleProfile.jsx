import React, { useState, useEffect, useRef } from "react";
import ProfilePosts from "./ProfilePosts";
import ProfileDesc from "./ProfileDesc";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../Helpers/sendRequest";

export default function Profile() {
  const username = useParams().username;
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/${username}/posts`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchUser = async () => {
    await axios
      .get(`${BASE_URL}/users/${username}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [username]);

  return (
    <div className="flex-1 overflow-y-scroll p-2">
      <ProfileDesc user={user} posts={posts} />
      <div
        style={{ height: "1.7px" }}
        className="w-full bg-stone-300 overflow-hidden"
      ></div>
      <ProfilePosts posts={posts} />
    </div>
  );
}
