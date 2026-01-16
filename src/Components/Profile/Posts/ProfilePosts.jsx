import PropTypes from "prop-types";
import { useState } from "react";
import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query'
import Modal from "../../UI/Modal";
import PostsGrid from "./PostsGrid";
import { fetchPosts } from "../../../Utils/FetchUtils";

const ProfilePosts = (props) => {
  const [activePost, setActivePost] = useState(null);

  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["profile", 'posts', { type: 'posted' }, props.username],
    queryFn: (...args) => fetchPosts(props.username, "posts", ...args),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length < 3) return undefined;
      return pages?.length;
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    staleTime: 10000 * 60
  })

  return (
    <>
      {activePost && (
        <Modal
          title="View Post"
          postId={activePost?._id}
          postOwner={activePost?.owner}
          openModalHandler={setActivePost}
        />
      )}

      <PostsGrid setActivePost={setActivePost} hasMore={hasNextPage} fetchNextPage={fetchNextPage} postPages={data?.pages} loading={isFetching} />
    </>
  );
};

export default ProfilePosts;

ProfilePosts.propTypes = {
  username: PropTypes.string.isRequired
};


