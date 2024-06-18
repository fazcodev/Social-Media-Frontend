import { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "../../UI/ImageOverlay.css";
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

  

  return (
    <div className="grid grid-flow-row grid-cols-3 gap-1">
      
      {posts.length > 0 &&
        posts.map((post, idx) => (
          <div
            key={idx}
            onClick={() => setActivePost(post?._id)}
            className={`aspect-square relative overflow-hidden bg-black cursor-pointer flex items-center img-overlay`}
            ref={posts.length === idx + 1 ? lastPostElementRef : null}
          >
            <img
              className="w-full h-full object-cover"
              src={post.imageUrl}
              alt="post"
            />

            <div className="middle text-white text-center z-10">
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
        ))}
      {hasMore && (
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
