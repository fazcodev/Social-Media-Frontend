import { useState, useRef, useCallback } from "react";
import usePagFetch from "../../Hooks/usePagFetch";
import FeedCard from "./FeedCard/FeedCard";
import { CircularProgress } from "@mui/material";
import { apiUrl } from "../../config";

const Home = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const url = `${apiUrl}/feeds`;
  const {
    loading,
    results: feedPosts,
    hasMore,
  } = usePagFetch("", pageNumber, 10, url);

  const observer = useRef();
  const lastPostElementRef = useCallback( 
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
          }
        },
        { rootMargin: "500px" }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  return (
    <div className="text-center flex-1 max-h-screen overflow-scroll img-wrapper">
      {feedPosts.map((post, idx) => {
          return <FeedCard post={post} key={idx} ref={idx + 1 == feedPosts.length ? lastPostElementRef : null} />;
        
      })}
      {loading && <CircularProgress />}
    </div>
  );
};

export default Home;
