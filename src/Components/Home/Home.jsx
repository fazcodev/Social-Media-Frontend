import { useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import FeedCard from "./FeedCard/FeedCard";
import { CircularProgress } from "@mui/material";
import { apiUrl } from "../../Config/config";

const Home = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam, ...args }) => {
      const limit = 5;
      const res = await axios.get(`${apiUrl}/feeds`, {
        params: { skip: pageParam * limit, limit: limit },
        withCredentials: true,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 5) return null;
      return pages.length;
    },
    initialPageParam: 0,
  });

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "500px" }
      );
      if (node) observer.current.observe(node);
    },
    [isFetching, hasNextPage]
  );

  return (
    <div className="w-full min-h-screen py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-6">
        {data?.pages?.length > 0 && data?.pages?.map((page, idx) =>
          page?.map((post, index) => {
            if (data.pages.length === idx + 1 && page.length === index + 1) {
              return (
                <FeedCard ref={lastPostElementRef} key={post._id} post={post} />
              );
            } else {
              return <FeedCard key={post._id} post={post} />;
            }
          })
        )}
        {isFetching && (
          <div className="flex justify-center p-4">
            <CircularProgress sx={{ color: '#38bdf8' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
