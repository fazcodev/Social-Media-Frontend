import { useState } from "react";
import Modal from "../UI/Modal";
import PostsGrid from "../Profile/Posts/PostsGrid";
import usePagFetch from "../../Hooks/usePagFetch";
import { apiUrl } from "../../config";
export default function Explore() {
  const [activePost, setActivePost] = useState(null); // [0, 1, 2, 3, 4
  const explorePostsURL = `${apiUrl}/explore`;
  const [pageNumber, setPageNumber] = useState(0);
  const {
    loading,
    results: explorePosts,
    hasMore,
  } = usePagFetch("", pageNumber, 3, explorePostsURL);
  return (
    <>
      {activePost && (
        <Modal
          title="View Post"
          post={activePost}
          openModalHandler={setActivePost}
        />
      )}

      <div className="flex flex-1 justify-evenly my-5 overflow-y-scroll">
        <div className="w-11/12">
          <PostsGrid
            setActivePost={setActivePost}
            posts={explorePosts}
            loading={loading}
            hasMore={hasMore}
            setPageNumber={setPageNumber}
            isExplore={true}
          />
        </div>
      </div>
    </>
  );
}
