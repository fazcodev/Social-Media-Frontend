import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../../Utils/FetchUtils";
import PropTypes from 'prop-types'
import Modal from "../../UI/Modal";
import PostsGrid from "./PostsGrid";

const SavedPosts = (props) => {
  const [activePost, setActivePost] = useState(null);
  const {data, hasNextPage, fetchNextPage, isLoading} = useInfiniteQuery({
    queryKey: ["profile", 'posts', {type: 'saved'}, props.username],
    queryFn: (...args) => fetchPosts(props.username, "saved", ...args),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 3) return null;
      return pages.length
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    staleTime: 10000*60
  })
  console.log(hasNextPage)
  return (
    <>
      {activePost && (
        <Modal
          title="View Post"
          postId={activePost._id}
          postOwner={activePost.owner}
          openModalHandler={setActivePost}
        />
      )}

      <PostsGrid setActivePost = {setActivePost} hasMore = {hasNextPage} fetchNextPage = {fetchNextPage} postPages = {data?.pages} loading = {isLoading} />
    </>
  );
};

export default SavedPosts;

SavedPosts.propTypes = {
  username: PropTypes.string.isRequired
};