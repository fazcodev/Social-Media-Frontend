import { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import "../../UI/ImageOverlay.css";
import { FavoriteOutlined, MapsUgc } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { v4 as uuid } from "uuid";
import { fetchPost } from "../../../Utils/FetchUtils";
export default function PostsGrid(props) {
  const {
    setPageNumber,
    fetchNextPage,
    loading,
    hasMore,
    postPages,
    setActivePost,
  } = props;
  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            if (fetchNextPage && hasMore) fetchNextPage();
          }
        },
        { rootMargin: "200px" }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPageNumber]
  );


  const queryClient = useQueryClient();

  const prefetchPost = async (post) => {
    /* await queryClient.prefetchQuery({
      queryKey: ["post", post._id, { type: "info" }],
      queryFn: async () => await fetchPost(post._id),
      initialData: async() => {
        return queryClient
          .getQueryData(["profile", "posts", { type: "posted" }, post.owner.username])
          ?.pages.flat()
          .find((p) => p._id === post._id);
        // return data;
      },
      initialDataUpdatedAt: queryClient.getQueryState([
        "profile",
        "posts",
        { type: "posted" },
        post.owner.username
      ])?.dataUpdatedAt,
      staleTime: 5000 * 60,
    }); */

    await queryClient.prefetchInfiniteQuery({
      queryKey: ["post", post._id, { type: "comments" }],
      queryFn: async (...args) => {
        const data = await fetchComments(post._id, ...args);
        if (args[0].pageParam == 0) {
          bottomRef.current?.scrollIntoView({ behavior: "auto" });
        }
        return data;
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage?.length < 10) return null;
        return pages.length;
      },
      initialPageParam: 0,
      pages: 1,
    });
  };

  return (
    <div className="grid grid-flow-row grid-cols-3 gap-1">
      {postPages?.length > 0 &&
        postPages.map((posts, idx) =>
          posts.map((post, pid) => (
            <div
              key={post._id}
              onClick={() => setActivePost(post)}
              onMouseEnter={() => prefetchPost(post)}
              className={`aspect-square relative overflow-hidden bg-black cursor-pointer flex items-center img-overlay`}
              ref={
                postPages?.length === idx + 1 && pid === 0
                  ? lastPostElementRef
                  : null
              }
            >
              <img
                className="w-full h-full object-cover"
                src={post.imageUrl}
                alt="post"
              />

              <div className="middle w-full text-center text-white z-10">
                <button>
                  <FavoriteOutlined />
                  {post.likesCount}
                </button>
                <button className="ml-5 mtiny:ml-2">
                  <MapsUgc />
                  {post.commentsCount}
                </button>
              </div>
              <div className="overlay w-full h-full" />
            </div>
          ))
        )}
      {loading && (
        <>
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ aspectRatio: "1/1", height: "auto" }}
            className="basis-1/3 shrink-0"
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ aspectRatio: "1/1", height: "auto" }}
            className="basis-1/3 shrink-0"
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ aspectRatio: "1/1", height: "auto" }}
            className="basis-1/3 shrink-0"
          />
        </>
      )}
    </div>
  );
}

PostsGrid.propTypes = {
  setPageNumber: PropTypes.func,
  loading: PropTypes.bool,
  hasMore: PropTypes.bool,
  posts: PropTypes.array,
  setActivePost: PropTypes.func,
};
