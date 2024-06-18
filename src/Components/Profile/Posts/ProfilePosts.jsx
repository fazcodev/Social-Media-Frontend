import PropTypes from "prop-types";
import { useState } from "react";

import Modal from "../../UI/Modal";
import PostsGrid from "./PostsGrid";

const ProfilePosts = (props) => {
  const [activePost, setActivePost] = useState(null);

  return (
    <>
      {activePost && (
        <Modal
          title="View Post"
          post={activePost}
          openModalHandler={setActivePost}
        />
      )}

      <PostsGrid setActivePost={setActivePost} posts={props.posts} />
    </>
  );
};

export default ProfilePosts;

ProfilePosts.propTypes = {
  posts: PropTypes.array.isRequired,
};


