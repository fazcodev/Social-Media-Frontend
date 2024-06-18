import { useState } from "react";
import PropTypes from 'prop-types'
import WarningCard from "../../WarningCard";

import { Delete } from "@mui/icons-material";
import useDeletePost from "./useDeletePost";

const DeletePost = ({post, modalHandler}) => {
    const [deleteWarning, setDeleteWarning] = useState(false);
    const {deletePost} = useDeletePost(modalHandler)
  return (
    <>
      {deleteWarning && (
        <WarningCard
          title="Delete Warning"
          message="Are you sure you want to delete this post?"
          confirmText="Delete"
          onConfirm={deletePost}
          onCancel={() => setDeleteWarning(false)}
          openModalHandler={setDeleteWarning}
        />
      )}
      {post?.owner?.username == localStorage.getItem("username") && (
        <button onClick={() => setDeleteWarning(true)}>
          <Delete fontSize="small" color="error" />
        </button>
      )}
    </>
  );
};

export default DeletePost;

DeletePost.propTypes = {
    post: PropTypes.object,
    modalHandler: PropTypes.func.isRequired
}
