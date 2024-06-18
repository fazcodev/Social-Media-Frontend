import { useState, useEffect } from "react";
import ProfilePosts from "./Posts/ProfilePosts";
import ProfileDesc from "./ProfileDesc";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../config";

export default function Profile() {
  const username = useParams().username;
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/${username}/posts`, {
        withCredentials : true
      });
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchUser = async () => {
    await axios
      .get(`${apiUrl}/users/${username}`)
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
        className="w-full bg-stone-300 overflow-hidden my-2"
      ></div>
      <ProfilePosts posts={posts} />
    </div>
  );
}
