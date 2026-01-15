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
          postOwner={post?.owner}
          postId={post?._id}
          title="View Post"
          openModalHandler={setOpenPostModal}
        />
      )}
      {commentsCount >= 0 && (
        <button
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors mb-2"
          onClick={() => setOpenPostModal(true)}
        >
          View all{" "}
          <span className="text-slate-900 dark:text-white font-semibold">{` ${commentsCount} comments`}</span>
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
