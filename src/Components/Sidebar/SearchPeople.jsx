import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiUrl } from "../../Config/config";
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
  const { data: followings, isLoading } = useQuery({
    queryKey: ["profile", 'desc', { type: 'followings' }, localStorage.getItem("username")],
    queryFn: () => fetchFollowings(localStorage.getItem("username")),
    enabled: localStorage.getItem("username") ? true : false,
    staleTime: 5000 * 60
  })
  useEffect(() => {
    if (searchRef.current && active) {
      searchRef.current.focus();
    }
  }, [searchRef.current, active]);

  return (
    <div
      className={`fixed top-0 left-0 w-80 z-40 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl h-screen border-r border-white/50 dark:border-white/10 shadow-2xl transition-all duration-500 ease-in-out ${active
        ? "visible translate-x-[80px] opacity-100"
        : "-translate-x-full invisible opacity-0"
        }`}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-accent/50">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"
          />
          <Search className="text-slate-400" />
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        {searchResults.length > 0 && (
          <div className="w-full flex flex-col p-2">
            {searchResults.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                followings={followings || []}
                loading={loading || isLoading}
              />
            ))}
          </div>
        )}
        {searchResults.length === 10 && (
          <div className="w-full flex justify-center py-4">
            <button
              className="text-slate-500 dark:text-slate-400 font-semibold hover:text-accent transition-colors"
              onClick={() => setPageNumber((prev) => prev + 1)}
            >
              See More Results
            </button>
          </div>
        )}
        {searchResults.length === 0 && (
          <div className="text-center p-6 text-slate-500 dark:text-slate-400">
            <h1 className="text-sm font-semibold">No results found</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPeople;

SearchPeople.propTypes = {
  active: PropTypes.bool,
};
