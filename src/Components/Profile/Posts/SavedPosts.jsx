import { useState } from "react";
import PropTypes from 'prop-types'
import Modal from "../../UI/Modal";
import PostsGrid from "./PostsGrid";

const ProfilePosts = (props) => {
  const [activePostId, setActivePostId] = useState(null);

  return (
    <>
      {activePostId && (
        <Modal
          title="View Post"
          postId={activePostId}
          openModalHandler={setActivePostId}
        />
      )}

      <PostsGrid setActivePost={setActivePostId} posts={props.posts} />
    </>
  );
};

export default ProfilePosts;

ProfilePosts.propTypes = {
  posts: PropTypes.array.isRequired,
};