import { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiUrl } from "../../../../Config/config";
import WarningCard from "../../WarningCard";
import { Delete } from "@mui/icons-material";

const DeletePost = ({ post, modalHandler }) => {
  const [deleteWarning, setDeleteWarning] = useState(false);
  const deletePost = async () => {
    try {
      await axios.delete(`${apiUrl}/posts/${post._id}`, {
        withCredentials: true,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setDeleteWarning(false);
      if (modalHandler) modalHandler(null);
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "profile" &&
            ["posted", "info"].includes(query.queryKey[2].type) &&
            query.queryKey.includes(localStorage.getItem("username"))
          );
        },
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <>
      {deleteWarning && (
        <WarningCard
          title="Delete Warning"
          message="Are you sure you want to delete this post?"
          confirmText="Delete"
          onConfirm={mutation.mutate}
          onCancel={() => setDeleteWarning(false)}
          openModalHandler={setDeleteWarning}
          pending = {mutation.isPending}
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
  modalHandler: PropTypes.func.isRequired,
};
