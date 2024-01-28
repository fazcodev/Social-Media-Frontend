import { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "../UI/ImageOverlay.css";
import { FavoriteOutlined, MapsUgc } from "@mui/icons-material";
import { Skeleton } from "@mui/material";

export default function PostsGrid(props) {
  const { setPageNumber, loading, hasMore, posts, setActivePost } = props;
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
        { rootMargin: "200px" }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPageNumber]
  );

  const postRow = (idx) => {
    const row = [];
    for (let i = idx; i < posts.length && i < idx + 3; i++) {
      row.push(
        <div
          key={i}
          onClick={() => setActivePost(posts[i])}
          className={`basis-[33%] shrink-0 aspect-square relative overflow-hidden bg-black cursor-pointer flex items-center img-overlay`}
          ref={posts.length === i + 1 ? lastPostElementRef : null}
        >
          <img
            className="w-full h-full object-cover"
            src={posts[i].imageUrl}
            alt="post"
          />

          <div className="middle text-white text-center z-10">
            <button>
              <FavoriteOutlined />
              {posts[i].likesCount}
            </button>
            <button className="ml-5 mtiny:ml-2">
              <MapsUgc />
              {posts[i].commentsCount}
            </button>
          </div>
          <div className="overlay w-full h-full" />
        </div>
      );
    }
    return row;
  };

  return (
    <div className="flex flex-col p-2 gap-1 justify-start">
      {posts.length > 0 &&
        Array(Math.ceil(posts.length / 3))
          .fill()
          .map((_, idx) => (
            <div
              key={idx}
              className="flex gap-1 items-stretch justify-start shrink-0"
            >
              {postRow(idx * 3)}
            </div>
          ))}
      {
        <>
          {hasMore &&
            Array(1)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="flex gap-1 items-stretch justify-start"
                >
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
                </div>
              ))}
        </>
      }
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
