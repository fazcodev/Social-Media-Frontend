import { useState } from "react";
import PropTypes from "prop-types";
import CommentSection from "../../UI/PostCard/Comment/CommentSection";
import Modal from "../../UI/Modal";

const CardComments = ({ post }) => {
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [openPostModal, setOpenPostModal] = useState(false);
  return (
    <>
      {openPostModal && (
        <Modal
          username = {post.owner.username}
          postId={post._id}
          title="View Post"
          openModalHandler={setOpenPostModal}
        />
      )}
      {commentsCount >= 0 && (
        <button
          className="text-blue-500"
          onClick={() => setOpenPostModal(true)}
        >
          View all{" "}
          <span className="text-black">{` ${commentsCount} comments`}</span>
        </button>
      )}
      <CommentSection
        setCount={setCommentsCount}
        comment={true}
        class="flex"
        postId={post._id}
      />
    </>
  );
};

CardComments.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CardComments;
