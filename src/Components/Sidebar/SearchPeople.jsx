import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { apiUrl } from "../../config";
import usePagFetch from "../../Hooks/usePagFetch";
import { fetchFollowings } from "../../Utils/FetchUtils";
import { Search } from "@mui/icons-material";
import UserCard from "./UserCard";

const SearchPeople = ({ active }) => {
  const [followings, setFollowings] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [query, setQuery] = useState("");
  const url = `${apiUrl}/users/search`;
  const { loading, results: searchResults } = usePagFetch(
    query,
    pageNumber,
    10,
    url
  );

  useEffect(() => {
    fetchFollowings(localStorage.getItem("username")).then((res) => {
      setFollowings(res);
    });
  }, []);

  const userHandler = async (username, req) => {
    setDisabled(true);
    await axios({
      method: req == "follow" ? "post" : "delete",
      url: `${apiUrl}/users/${username}/${req}`,
      withCredentials: true,
    })
      .then((res) => {
        fetchFollowings(localStorage.getItem("username"));
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
            <UserCard
              key={user._id}
              user={user}
              followings={followings}
              userHandler={userHandler}
              disabled={disabled}
              loading={loading}
            />
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

SearchPeople.propTypes = {
  active: PropTypes.bool,
};
