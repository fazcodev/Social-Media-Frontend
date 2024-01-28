import React, { useEffect, useState } from "react";
import { QueryStatsSharp, Search } from "@mui/icons-material";
import axios from "axios";
import useFetch from "../../Hooks/useFetch";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AvatarPNG from "../Assets/Default_Avatar.png";
import { BASE_URL } from "../Helpers/sendRequest";

const SearchPeople = ({ active }) => {
  const [followings, setFollowings] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [query, setQuery] = useState("");
  const url = `${BASE_URL}/users/search`;
  const {
    loading,
    error,
    results: searchResults,
    hasMore,
  } = useFetch(query, pageNumber, 10, url);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/${localStorage.getItem("username")}/followings`
      );
      setFollowings(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchFollowing();
  }, []);

  const userHandler = async (username, req) => {
    setDisabled(true);
    await axios({
      method: req == "follow" ? "post" : "delete",
      url: `${BASE_URL}/users/${username}/${req}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        fetchFollowing();
      })
      .catch((err) => {
        console.log(err);
      });
    setDisabled(false);
  };

  return (
    <div
      className={`absolute top-0 left-0 w-1/4 z-20 mtiny:w-2/5 bg-stone-50 rounded-lg overflow-hidden h-screen border border-stone-200 ${
        !active
          ? "-translate-x-20 invisible opacity-0"
          : "visible translate-x-14 opacity-100"
      } transition-all duration-500`}
    >
      <div className="w-full bg-white rounded-lg shadow px-2 py-3 flex">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none"
        />
        <Search className="text-stone-300" />
      </div>

      {searchResults.length > 0 && (
        <div className="w-full flex flex-col">
          {searchResults.map((user) => (
            <div
              onClick={() => {
                user.username !== localStorage.getItem("username")
                  ? navigate(`/profile/users/${user.username}`)
                  : navigate("/profile/posts");
              }}
              key={user._id}
              className="w-full flex items-center cursor-pointer p-2 border-b border-stone-200"
            >
              <img
                src={user.avatarURL === undefined ? AvatarPNG : user.avatarURL}
                alt=""
                className="w-10 h-10 mtiny:w-7 mtiny:h-7 rounded-full object-cover"
              />
              <div className="ml-2">
                <h1 className="text-sm font-bold">{user.name}</h1>
                <h1 className="text-xs">@{user.username}</h1>
              </div>
              <div className="ml-auto">
                {user.username === localStorage.getItem("username") ? (
                  <button className="disabled text-stone-600 hover:text-black text-sm font-bold">
                    You
                  </button>
                ) : followings.find((u) => u.following === user._id) ? (
                  <button
                    onClick={(e) => {
                      userHandler(user.username, "unfollow");
                      window.location.reload(false);
                      e.stopPropagation();
                    }}
                    disabled={disabled || loading}
                    className="text-white bg-blue-500 rounded-md px-2 py-0.5 hover:bg-blue-600 text-xs font-semibold"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      userHandler(user.username, "follow");
                      window.location.reload(false);
                      e.stopPropagation();
                    }}
                    disabled={disabled || loading}
                    className="text-white bg-blue-500 rounded-md px-2 py-0.5 hover:bg-blue-600 text-xs font-semibold"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {searchResults.length === 10 && (
        <div className="w-full flex justify-center">
          <button
            className="text-stone-300 font-semibold"
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            See More Results
          </button>
        </div>
      )}
      {searchResults.length === 0 && (
        <div className="text-center p-2 border-b border-stone-200">
          <h1 className="text-sm font-bold">No results found</h1>
        </div>
      )}
    </div>
  );
};

export default SearchPeople;
