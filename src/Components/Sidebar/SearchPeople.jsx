import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiUrl } from "../../config";
import usePagFetch from "../../Hooks/usePagFetch";
import { fetchFollowings } from "../../Utils/FetchUtils";
import { Search } from "@mui/icons-material";
import UserCard from "./UserCard";

const SearchPeople = ({ active }) => {
  const queryClient = useQueryClient();
  // const [followings, setFollowings] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [query, setQuery] = useState("");
  const searchRef = useRef();
  const url = `${apiUrl}/users/search`;
  const { loading, results: searchResults } = usePagFetch(
    query,
    pageNumber,
    10,
    url
  );
  const {data: followings, isLoading} = useQuery({
    queryKey: ["profile", 'desc', {type: 'followings'}, localStorage.getItem("username")],
    queryFn: ()=>fetchFollowings(localStorage.getItem("username")),
    enabled: localStorage.getItem("username") ? true : false,
    staleTime: 5000*60
  })
  useEffect(() => {
    if(searchRef.current && active){
      searchRef.current.focus();
    }
  }, [searchRef.current, active]);

  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const fetchState = queryClient.getQueryState([
  //       "profile",
  //       localStorage.getItem("username"),
  //       "followings",
  //     ]);
  //     if (fetchState?.data && !fetchState.isInvalidated) {
  //       console.log(fetchState.data);
  //       setFollowings(fetchState.data);
  //     } else {
  //       const { data } = await queryClient.fetchQuery({
  //         queryKey: ["profile", localStorage.getItem("username"), "followings"],
  //         queryFn: ()=>fetchFollowings(localStorage.getItem("username")),
  //       });
  //       setFollowings(data);
  //     }
  //   };
  //   if(query.length == 1)fetchData();
  // }, [query]);

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
          ref={searchRef}
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
              loading={loading || isLoading}
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
